from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    # apps
    path("api/accounts/", include("account.urls")),
    path("api/", include("blog.urls")),
]
