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
    path("blog/delete/<int:id>/", DeleteBlogView.as_view(), name="delete-blog"),
    # toggle blog status
    path(
        "blog/toggle-status/<int:pk>/",
        ToggleBlogStatusView.as_view(),
        name="toggle-blog-status",
    ),
    # comments
    path("comment/create/", CreateComment.as_view(), name="create-comment"),
    path(
        "blog/comments/<slug:slug>/", BlogCommentsView.as_view(), name="blog-comments"
    ),
    path(
        "comment/delete/<int:comment_id>/",
        DeleteComment.as_view(),
        name="delete-comment",
    ),
    path("blog/edit/<int:pk>/", EditBlogView.as_view(), name="edit-blog"),
    # saved blogs
    path("blog/saved/", UserSavedBlogsView.as_view(), name="saved-blogs"),
    path("blog/save/<int:blog_id>/", SavedBlogsView.as_view(), name="save-blog"),
    # notifications
    path("notifications/", GetNotificationView.as_view()),
    path("mark-all-as-read/", MarkAllAsRead.as_view(), name="mark-all-as-read"),
    path("mark-as-read/<int:id>", MarkAsRead.as_view(), name="mark-as-read"),
    path(
        "delete-notification/<int:id>",
        DeleteNotification.as_view(),
        name="delete-notification",
    ),
    path(
        "delete-all-notifications/",
        DeleteAllNotificationView.as_view(),
        name="delete-all-notifications",
    ),
    path("unread-count/", UnreadCountAPIView.as_view(), name="unread-count"),
    # agent
    path("chatbot/", ChatBotView.as_view(), name="chatbot"),
]
