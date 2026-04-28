from django.urls import path

from .views import *


urlpatterns = [
    # category
    path("categories/", GetAllCategoryView.as_view(), name="category"),
    path("categories/create/", CreateCategoryView.as_view(), name="create-category"),
    path(
        "categories/delete/<int:pk>/",
        DeleteCategoryView.as_view(),
        name="delete-category",
    ),
    # blogs
    path("blogs/", BlogListView.as_view(), name="blogs"),
    path("recent/", RecentBlogsView.as_view(), name="recent-blogs"),
    path("featured/", FeaturedBlogsView.as_view(), name="featured-blogs"),
    path("admin/blogs/", AdminBlogListView.as_view(), name="admin-blogs"),
    path("blogs/<slug:slug>/", SingleBlogView.as_view(), name="single-blog"),
    path("blog/create/", CreateBlogView.as_view(), name="create-blog"),
]
