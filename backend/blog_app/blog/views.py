from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter


from .models import *
from .serializers import *
from .pagination import BlogPagination

# Create your views here.


class GetAllCategoryView(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("created_at")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


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
