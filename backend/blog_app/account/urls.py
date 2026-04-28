from django.urls import path

from .views import *

urlpatterns = [
    # register
    path("register", RegisterView.as_view(), name="register"),
    path("activate/<uidb64>/<token>/", ActivateView.as_view(), name="active-user"),
    # login
    path("login", LoginView.as_view(), name="login"),
    # refresh token
    path("refresh", RefreshTokenView.as_view(), name="refresh-token"),
    # profile
    path("profile", ProfileView.as_view(), name="profile"),
    # user
    path("users/", GetAllUserView.as_view(), name="user"),
    path("users/<int:pk>/", GetAllUserView.as_view(), name="user-detail"),
    # activity
    path("activity/", ActiveUserAnalyticsView.as_view(), name="user-activity"),
    # logout
    path("logout", LogoutView.as_view(), name="logout"),
]
