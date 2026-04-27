from django.db.models import Q
from datetime import timedelta
from django.utils.timezone import now
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
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from blog.permissions import IsAdmin

from .serializers import *
from .pagination import UserPagination

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


class GetAllUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = UserPagination

    def get(self, request):
        users = User.objects.all().exclude(is_superuser=True).exclude(role="admin")

        search = request.GET.get("search")

        if search:
            users = users.filter(
                Q(username__icontains=search) | Q(email__icontains=search)
            )

        is_active = request.GET.get("is_active")

        if is_active is not None:
            if is_active.lower() == "true":
                users = users.filter(is_active=True)
            elif is_active.lower() == "false":
                users = users.filter(is_active=False)

        paginator = UserPagination()
        result_page = paginator.paginate_queryset(users, request)

        serializer = ProfileSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def patch(self, request, pk):
        try:
            user = (
                User.objects.exclude(is_superuser=True).exclude(role="admin").get(pk=pk)
            )
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class ActiveUserAnalyticsView(APIView):
    def get(self, request):

        data = []

        for i in range(5, -1, -1):
            month_date = now() - timedelta(days=30 * i)

            count = User.objects.filter(
                is_active=True,
                created_at__month=month_date.month,
                created_at__year=month_date.year,
            ).count()

            data.append({"month": month_date.strftime("%b %Y"), "activeUsers": count})

        return Response(data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful"}, status=200)

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        response.delete_cookie("__auth")

        return response
