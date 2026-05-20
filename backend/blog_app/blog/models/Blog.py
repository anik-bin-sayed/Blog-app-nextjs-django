from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

from cloudinary.models import CloudinaryField

import unicodedata


from .Category import Category

User = get_user_model()


class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="category"
    )

    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    content = models.TextField()
    image = CloudinaryField(blank=True, null=True)
    image_public_id = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)

    is_featured = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            text = unicodedata.normalize("NFKD", self.title)
            ascii_text = text.encode("ascii", "ignore").decode("utf-8")

            base_slug = slugify(ascii_text)

            slug = base_slug
            counter = 1

            while Blog.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class SavedBlog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "blog")

    def __str__(self):
        return f"{self.user.username} saved {self.blog.title}"
