from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode


from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RegisterSerializer

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            activation_link = (
                f"http://localhost:8000/api/accounts/activate/{uid}/{token}/"
            )

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
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                }
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
