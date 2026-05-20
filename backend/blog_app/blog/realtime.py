from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .serializers import NotificationSerializer


def push_notification(notification):
    """Send a notification to the user's WebSocket group via Redis."""
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    data = NotificationSerializer(notification).data
    group_name = f"notifications_{notification.user_id}"

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "data": data,
        },
    )
