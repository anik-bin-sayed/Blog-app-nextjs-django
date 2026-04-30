from rest_framework import serializers
from blog.models import Comment


class CommentListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["name", "content", "created_at"]
