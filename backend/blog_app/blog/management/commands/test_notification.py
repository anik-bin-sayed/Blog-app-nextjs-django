import asyncio
import json
from django.core.management.base import BaseCommand
from channels.layers import get_channel_layer


class Command(BaseCommand):
    help = "Send a test notification to a specific user via WebSocket"

    def add_arguments(self, parser):
        parser.add_argument("user_id", type=int, help="User ID to send notification to")
        parser.add_argument(
            "--message",
            type=str,
            default="Test notification",
            help="Notification message",
        )
        parser.add_argument("--actor", type=str, default="Admin", help="Actor name")
        parser.add_argument("--blog", type=str, default="Test Blog", help="Blog title")

    def handle(self, *args, **options):
        user_id = options["user_id"]
        message = options["message"]
        actor = options["actor"]
        blog = options["blog"]

        channel_layer = get_channel_layer()

        notification_data = {
            "id": 999,
            "message": message,
            "actor_name": actor,
            "blog_title": blog,
            "comment": "Test comment",
            "is_read": False,
            "created_at": "2026-05-22T11:40:00Z",
        }

        group_name = f"notifications_{user_id}"

        self.stdout.write(
            self.style.SUCCESS(f"📤 Sending test notification to user {user_id}")
        )
        self.stdout.write(f"   Group: {group_name}")
        self.stdout.write(f"   Message: {message}")

        try:
            asyncio.run(
                channel_layer.group_send(
                    group_name, {"type": "send_notification", "data": notification_data}
                )
            )
            self.stdout.write(
                self.style.SUCCESS("✅ Test notification sent successfully!")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error sending notification: {str(e)}")
            )
