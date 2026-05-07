from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from ..permissions import IsAdmin
from ..models import Notification
from ..serializers import NotificationSerializer
from ..pagination import BlogPagination


class GetNotificationView(ListAPIView):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = BlogPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["is_read"]


class MarkAllAsRead(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request):
        notifications = Notification.objects.filter(user=request.user)

        for notification in notifications:
            notification.is_read = not notification.is_read

        Notification.objects.bulk_update(notifications, ["is_read"])

        return Response(
            {"message": "All notifications toggled"},
            status=200,
        )


class MarkAsRead(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, id):
        notification = get_object_or_404(Notification, id=id, user=request.user)

        if not notification.is_read:
            notification.is_read = True
            notification.save()

        return Response(
            {"success": True, "message": "Notification marked as read"}, status=200
        )


class DeleteNotification(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        notification = get_object_or_404(Notification, id=id, user=request.user)

        notification.delete()

        return Response(
            {"success": True, "message": "Notification deleted successfully"},
            status=200,
        )


class DeleteAllNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Notification.objects.filter(user=request.user).delete()

        return Response(
            {"success": True, "message": "All notifications deleted successfully"},
            status=200,
        )


class UnreadCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()

        return Response({"unread_count": count})
