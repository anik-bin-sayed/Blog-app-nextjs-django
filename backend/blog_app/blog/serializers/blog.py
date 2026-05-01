from rest_framework import serializers
from blog.models import Blog


class BlogListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "slug",
            "title",
            "image",
            "excerpt",
            "category",
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


class SingleBlogSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
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
