from django.urls import path

from .views import RegisterView, ActivateView, LoginView, RefreshTokenView

urlpatterns = [
    # register
    path("register", RegisterView.as_view(), name="register"),
    path("activate/<uidb64>/<token>/", ActivateView.as_view(), name="active-user"),
    # login
    path("login", LoginView.as_view(), name="login"),
    # refresh token
    path("refresh", RefreshTokenView.as_view(), name="refresh-token"),
]
