from rest_framework import serializers
from blog.models import Comment


class CommentListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "name", "content", "user", "created_at"]


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["blog", "content"]
