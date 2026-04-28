from rest_framework import serializers

from .models import *


# category serializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CreateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

    def validate_name(self, value):
        if Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("Category already exists")
        return value


# Blog serializers
class BlogListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "title",
            "slug",
            "category",
            "excerpt",
            "image",
            "is_public",
            "created_at",
        ]

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


class CommentListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["name", "content", "created_at"]


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


# create blog serializer


class CreateBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            "title",
            "slug",
            "category",
            "is_public",
            "excerpt",
            "content",
            "image",
        ]
