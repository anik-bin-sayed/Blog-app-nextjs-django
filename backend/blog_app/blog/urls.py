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
    path("blog/delete/<int:pk>/", DeleteBlogView.as_view(), name="delete-blog"),
    # toggle blog status
    path(
        "blog/toggle-status/<int:pk>/",
        ToggleBlogStatusView.as_view(),
        name="toggle-blog-status",
    ),
    # comments
    path("comment/create/", CreateComment.as_view(), name="create-comment"),
    path(
        "comment/delete/<int:comment_id>/",
        DeleteComment.as_view(),
        name="delete-comment",
    ),
    path("blog/edit/<int:pk>/", EditBlogView.as_view(), name="edit-blog"),
]
