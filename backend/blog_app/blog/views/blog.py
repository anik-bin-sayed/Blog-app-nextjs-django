from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter


from ..models import *
from ..serializers import *
from ..pagination import BlogPagination
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
            serializer.save(author=request.user)
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

            comments = Comment.objects.filter(blog=blog).select_related("user")

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
        recent_blogs = Blog.objects.filter(is_public=True).order_by("-created_at")[:5]
        serializer = BlogListSerializer(recent_blogs, many=True)
        return Response(serializer.data)


class DeleteBlogView(DestroyAPIView):
    queryset = Blog.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]
