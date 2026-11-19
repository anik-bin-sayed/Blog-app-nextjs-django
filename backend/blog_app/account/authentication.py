from http.cookies import SimpleCookie

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.backends import BaseBackend
from .models import User


@database_sync_to_async
def _user_from_access_token(raw_token):
    try:
        authentication = JWTAuthentication()
        validated_token = authentication.get_validated_token(raw_token)
        return authentication.get_user(validated_token)
    except Exception:
        return AnonymousUser()


class CookieJWTAuthMiddleware:
    """Authenticate Channels connections with the access_token cookie."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        headers = {key.lower(): value for key, value in scope.get("headers", [])}
        cookie = SimpleCookie()
        cookie.load(headers.get(b"cookie", b"").decode("latin1"))
        access_token = cookie.get("access_token")

        scope["user"] = (
            await _user_from_access_token(access_token.value)
            if access_token
            else AnonymousUser()
        )
        return await self.inner(scope, receive, send)


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):

        raw_token = request.COOKIES.get("access_token")

        if not raw_token:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)

            user = self.get_user(validated_token)

            return (user, validated_token)

        except Exception as e:
            return None


class CustomAuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
