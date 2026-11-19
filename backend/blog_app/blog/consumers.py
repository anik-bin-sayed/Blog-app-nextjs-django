# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close(code=4401)
            return

        if user.role != "admin":
            await self.close(code=4403)
            return

        self.user = user
        self.group_name = f"notifications_{self.user.id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        await self.send_unread_count()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        notification = event.get("data") or {
            "id": event.get("id"),
            "actor_name": event.get("actor_name", event.get("actor", "")),
            "blog_title": event.get("blog_title", ""),
            "blog_slug": event.get("blog_slug", ""),
            "comment": event.get("comment", ""),
            "comment_id": event.get("comment_id"),
            "message": event.get("message", ""),
            "is_read": event.get("is_read", False),
            "created_at": event.get("created_at"),
        }
        await self.send(
            text_data=json.dumps(
                {
                    "type": "notification",
                    "notification": notification,
                }
            )
        )

    async def send_unread_count(self, event=None):
        count = await self.get_unread_count()
        await self.send(text_data=json.dumps({"type": "unread_count", "count": count}))

    @database_sync_to_async
    def get_unread_count(self):
        return Notification.objects.filter(user=self.user, is_read=False).count()
