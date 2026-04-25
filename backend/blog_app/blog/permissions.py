from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role == "admin"


class isOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
