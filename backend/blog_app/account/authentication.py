from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get("access_token")
        if raw_token is None:
            return None

        validate_token = self.get_validated_token(raw_token=raw_token)
        user = self.get_user(validated_token=validate_token)

        return (user, validate_token)
