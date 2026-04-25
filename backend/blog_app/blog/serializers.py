from rest_framework import serializers

from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class BlogListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ["title", "slug", "category", "excerpt", "image", "created_at"]

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class RelatedBlogSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ["title", "category", "excerpt", "image", "created_at", "slug"]

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class SingleBlogSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "title",
            "slug",
            "category",
            "excerpt",
            "content",
            "image",
            "created_at",
        ]

    def get_image(self, obj):
        return obj.image.url if obj.image else None
