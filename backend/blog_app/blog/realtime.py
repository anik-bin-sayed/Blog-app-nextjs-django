from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model

from .serializers import NotificationSerializer

User = get_user_model()


def _send_to_group(channel_layer, group_name, data):
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "data": data,
        },
    )


def push_notification(notification):
    """Send notification to the recipient and all admins (real-time dashboard)."""
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    data = NotificationSerializer(notification).data
    groups = {f"notifications_{notification.user_id}"}

    for admin_id in User.objects.filter(role="admin").values_list("id", flat=True):
        groups.add(f"notifications_{admin_id}")

    for group_name in groups:
        _send_to_group(channel_layer, group_name, data)
