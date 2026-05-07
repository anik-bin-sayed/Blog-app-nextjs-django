from django.db import models
from django.contrib.auth import get_user_model

from ..models import Comment

User = get_user_model()


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    actor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="actor", null=True, blank=True
    )
    blog = models.ForeignKey("Blog", on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(
        "Comment", on_delete=models.CASCADE, null=True, blank=True
    )

    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_comment_preview(self):
        if self.comment and self.actor and self.blog:
            short = self.comment.content[:80]
            return f"{self.actor.username} commented on {self.blog.title} — {short}"
        return ""
