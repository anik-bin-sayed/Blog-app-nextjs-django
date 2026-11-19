# utils.py বা notifications/services.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers.notification import NotificationSerializer


def push_notification(notification):
    channel_layer = get_channel_layer()
    payload = dict(NotificationSerializer(notification).data)

    async_to_sync(channel_layer.group_send)(
        f"notifications_{notification.user.id}",
        {
            "type": "send_notification",
            "data": payload,
        },
    )
