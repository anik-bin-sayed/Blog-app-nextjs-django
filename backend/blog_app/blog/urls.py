from django.urls import path

from .views import *


urlpatterns = [
    # category
    path("categories/", GetAllCategoryView.as_view(), name="category"),
    # blogs
    path("blogs/", BlogListView.as_view(), name="blogs"),
    path("blogs/<slug:slug>/", SingleBlogView.as_view(), name="single-blog"),
]
