from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from django.db import transaction
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

import cloudinary.uploader

from ..models import *
from ..serializers import *
from ..pagination import BlogPagination, CommentPagination
from ..permissions import IsAdmin


class BlogListView(ListAPIView):
    queryset = Blog.objects.filter(is_public=True)
    serializer_class = BlogListSerializer
    pagination_class = BlogPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["category"]
    search_fields = [
        "title",
        "excerpt",
        "content",
        "category__name",
    ]

    ordering_fields = ["created_at"]
    ordering = ["-created_at"]


class CreateBlogView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = CreateBlogSerializer(data=request.data)

        if serializer.is_valid():
            image_file = request.FILES.get("image")
            image_url = None
            image_public_id = None

            if image_file:
                result = cloudinary.uploader.upload(image_file)
                image_url = result["secure_url"]
                image_public_id = result["public_id"]

            serializer.save(
                author=request.user, image=image_url, image_public_id=image_public_id
            )

            return Response(
                {"success": True, "message": "Blog created successfully"}, status=201
            )
        else:
            return Response(serializer.errors, status=400)


class AdminBlogListView(ListAPIView):
    queryset = Blog.objects.filter(is_public=True)
    serializer_class = BlogListSerializer
    pagination_class = BlogPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["category"]
    search_fields = [
        "title",
        "excerpt",
        "content",
        "category__name",
    ]

    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        status = self.request.query_params.get("status")

        if status == "published":
            return Blog.objects.filter(is_public=True)
        elif status == "draft":
            return Blog.objects.filter(is_public=False)
        else:
            return Blog.objects.all()


class SingleBlogView(APIView):
    def get(self, request, slug):
        try:
            blog = Blog.objects.select_related("category").get(
                slug=slug, is_public=True
            )

            related_blogs = Blog.objects.filter(
                category=blog.category, is_public=True
            ).exclude(id=blog.id)[:3]

            comments = (
                Comment.objects.filter(blog=blog)
                .select_related("user")
                .order_by("-created_at")[:5]
            )

            return Response(
                {
                    "blog": SingleBlogSerializer(blog).data,
                    "relatedBlogs": RelatedBlogSerializer(
                        related_blogs, many=True
                    ).data,
                    "comments": CommentListSerializer(comments, many=True).data,
                }
            )

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)


class FeaturedBlogsView(APIView):
    def get(self, request):
        featured_blogs = Blog.objects.filter(is_featured=True, is_public=True).order_by(
            "-created_at"
        )[:4]
        serializer = BlogListSerializer(featured_blogs, many=True)
        return Response(serializer.data)


class RecentBlogsView(APIView):
    def get(self, request):
        recent_blogs = Blog.objects.filter(is_public=True).order_by("-created_at")[:4]
        serializer = BlogListSerializer(recent_blogs, many=True)
        return Response(serializer.data)


class DeleteBlogView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, id):
        try:
            blog = Blog.objects.get(id=id)
            print(blog)

            if blog.image_public_id:
                cloudinary.uploader.destroy(blog.image_public_id)

            blog.delete()

            return Response({"message": "Blog delete successfully"})
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found!"}, status=404)


class ToggleBlogStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            blog = Blog.objects.get(pk=pk)
            blog.is_public = not blog.is_public
            blog.save()
            return Response(
                {"success": True, "message": "Blog status updated successfully"}
            )
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)


class EditBlogView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def put(self, request, pk):
        try:
            blog = Blog.objects.get(pk=pk)
            serializer = EditBlogSerializer(blog, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"success": True, "message": "Blog updated successfully"}
                )
            else:
                return Response(serializer.errors, status=400)

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)


class SavedBlogsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, blog_id):
        user = request.user

        blog = get_object_or_404(Blog, id=blog_id, is_public=True)

        with transaction.atomic():
            saved_qs = SavedBlog.objects.select_for_update().filter(user=user)

            existing = saved_qs.filter(blog=blog).first()

            if existing:
                existing.delete()
                return Response(
                    {"success": True, "message": "Blog removed from saved list"}
                )

            if saved_qs.count() >= 8:
                return Response(
                    {"success": False, "message": "You can save maximum 8 blogs only"},
                    status=400,
                )

            SavedBlog.objects.create(user=user, blog=blog)

        return Response({"success": True, "message": "Blog added to saved list"})


class UserSavedBlogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        saved_blogs = SavedBlog.objects.filter(user=user).select_related("blog")
        blogs = [saved.blog for saved in saved_blogs]
        serializer = BlogListSerializer(blogs, many=True)
        return Response(serializer.data)
