from django.contrib.auth import authenticate
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


from .serializers import *

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exits"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exits"}, status=400)

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            activation_link = f"http://localhost:3000/activate/{uid}/{token}"

            subject = "Activate your account"

            html_content = render_to_string(
                "emails/activation.html",
                {
                    "user": user,
                    "activation_link": activation_link,
                },
            )

            email = EmailMultiAlternatives(
                subject=subject,
                body="Activate your account",
                from_email="your_email@gmail.com",
                to=[user.email],
            )

            email.attach_alternative(html_content, "text/html")
            email.send()

            return Response(
                {
                    "message": "User registered successfully. Please check your email.",
                },
                status=201,
            )

        return Response(serializer.errors)


class ActivateView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except:
            return Response("Invalid link")

        if user.is_active or user.is_verified:
            return Response({"error": "This link has already been used!"})

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.is_verified = True
            user.save()
            return Response({"message": "Account activated successfully"})
        else:
            return Response({"error": "Invalid or expired token"})


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        print(user)
        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.is_active:
            return Response(
                {"error": "Please active your account to login..."}, status=403
            )

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({"message": "Login successful"}, status=200)

        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 15,
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 60 * 24,
        )

        return response


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)

            response = Response({"message": "Token refreshed"}, status=200)

            response.set_cookie(
                key="access_token",
                value=access,
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=60 * 15,
            )

            return response

        except Exception:
            return Response({"error": "Invalid refresh token"}, status=401)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = ProfileSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful"}, status=200)

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        response.delete_cookie("__auth")

        return response
