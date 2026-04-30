from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.backends import BaseBackend
from .models import User


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
