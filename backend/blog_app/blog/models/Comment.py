from django.db import models
from django.contrib.auth import get_user_model

from .Blog import Blog

User = get_user_model()


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="blog")

    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user}-{self.content[:20]}"
