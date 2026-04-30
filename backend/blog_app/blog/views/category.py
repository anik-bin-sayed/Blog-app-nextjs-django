from django.db import IntegrityError


from rest_framework.views import APIView
from rest_framework.response import Response

from ..serializers import *


class GetAllCategoryView(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("created_at")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CreateCategoryView(APIView):
    def post(self, request):
        serializer = CreateCategorySerializer(data=request.data)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(
                    {"success": True, "message": "Category created successfully"},
                    status=201,
                )

        except IntegrityError:
            return Response(
                {"success": False, "message": "Category already exists"}, status=400
            )

        except Exception as e:
            return Response(
                {"success": False, "message": "Something went wrong"}, status=500
            )


class DeleteCategoryView(APIView):
    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response(status=204)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)
