from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )

    def has_object_permission(self, request, view, obj):
        return getattr(request.user, "role", None) == "admin"


class isOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
