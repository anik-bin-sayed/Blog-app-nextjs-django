from django.urls import path

from .views import *


urlpatterns = [
    # category
    path("categories/", GetAllCategoryView.as_view(), name="category"),
    # blogs
    path("blogs/", BlogListView.as_view(), name="blogs"),
    path("blogs/<slug:slug>/", SingleBlogView.as_view(), name="single-blog"),
    path("featured/", FeaturedBlogsView.as_view(), name="featured-blogs"),
    path("recent/", RecentBlogsView.as_view(), name="recent-blogs"),
    path("admin/blogs/", AdminBlogListView.as_view(), name="admin-blogs"),
]
