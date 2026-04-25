from rest_framework.views import APIView
from rest_framework.response import Response

from .models import *
from .serializers import *

# Create your views here.


class GetAllCategoryView(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("created_at")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class BlogListView(APIView):
    def get(self, request):
        blogs = Blog.objects.filter(is_public=True).order_by("-created_at")
        serializer = BlogListSerializer(blogs, many=True)
        return Response(serializer.data)


class SingleBlogView(APIView):
    def get(self, request, slug):
        try:
            blog = Blog.objects.select_related("category").get(
                slug=slug, is_public=True
            )

            related_blogs = Blog.objects.filter(
                category=blog.category, is_public=True
            ).exclude(id=blog.id)[:3]

            return Response(
                {
                    "blog": SingleBlogSerializer(blog).data,
                    "relatedBlogs": RelatedBlogSerializer(
                        related_blogs, many=True
                    ).data,
                }
            )

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)
