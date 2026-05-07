import re

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import DestroyAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from ..models import Comment, Notification
from ..serializers import CreateCommentSerializer


class CreateComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateCommentSerializer(data=request.data)

        if serializer.is_valid():
            comment = serializer.save(user=request.user)

            blog = comment.blog
            post_user = comment.blog.author

            if post_user != request.user:
                raw_username = request.user.username

                parts = re.split(r"[^a-zA-Z]+", raw_username)
                first = next((p for p in parts if p), "")

                name = first[0].upper() + first[1:] if first else ""

                Notification.objects.create(
                    user=post_user,
                    actor=request.user,
                    blog=blog,
                    comment=comment,
                    message=f"{name} commented {blog.title}",
                )

            return Response(
                {"success": True, "message": "Comment created successfully"}, status=201
            )

        return Response(serializer.errors, status=400)


class DeleteComment(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()
    lookup_url_kwarg = "comment_id"

    def perform_destroy(self, instance):
        user = self.request.user
        if not (user.role == "admin" or instance.user == user):
            raise PermissionDenied("You are not allowed to delete this comment")

        instance.delete()


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by(
            "-created_at"
        )

        data = [
            {
                "id": n.id,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at,
            }
            for n in notifications
        ]

        return Response(data)
