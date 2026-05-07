from django.contrib import admin

from .models import Blog, Comment, Category, SavedBlog, Notification

# Register your models here.

admin.site.register(Category)


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ("title", "author")
    list_filter = ("is_featured", "is_public", "category")
    search_fields = ("title", "content")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "blog",
    )


@admin.register(SavedBlog)
class SavedBlogAdmin(admin.ModelAdmin):
    list_display = ("user", "blog", "created_at")
    list_filter = ("created_at",)


admin.site.register(Notification)
