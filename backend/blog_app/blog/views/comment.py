import re

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import DestroyAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from ..models import Comment, Notification
from ..realtime import push_notification
from ..serializers import CreateCommentSerializer, CommentListSerializer
from ..models import Blog
from django.core.paginator import Paginator


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

                notification = Notification.objects.create(
                    user=post_user,
                    actor=request.user,
                    blog=blog,
                    comment=comment,
                    message=f"{name} commented {blog.title}",
                )
                push_notification(notification)

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


class BlogCommentsView(APIView):
    def get(self, request, slug):
        try:
            page_number = request.GET.get("page", 1)

            blog = Blog.objects.get(slug=slug, is_public=True)

            comments_qs = (
                Comment.objects.filter(blog=blog)
                .select_related("user")
                .order_by("-created_at")
            )

            paginator = Paginator(comments_qs, 5)
            page_obj = paginator.get_page(page_number)

            return Response(
                {
                    "comments": CommentListSerializer(page_obj, many=True).data,
                    "pagination": {
                        "count": paginator.count,
                        "next": page_obj.has_next(),
                        "previous": page_obj.has_previous(),
                        "current_page": page_obj.number,
                    },
                }
            )

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)
