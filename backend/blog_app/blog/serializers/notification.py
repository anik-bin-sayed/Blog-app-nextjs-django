from rest_framework import serializers

from ..models.Notification import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.username", read_only=True)
    blog_title = serializers.CharField(source="blog.title", read_only=True)
    blog_slug = serializers.CharField(source="blog.slug", read_only=True)
    comment = serializers.CharField(source="comment.content", read_only=True)
    comment_id = serializers.CharField(source="comment.id", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "actor_name",
            "blog_title",
            "blog_slug",
            "comment",
            "comment_id",
            "message",
            "is_read",
            "created_at",
        ]
