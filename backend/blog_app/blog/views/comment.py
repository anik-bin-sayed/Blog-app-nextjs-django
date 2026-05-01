from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import DestroyAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated


from ..models import Comment
from ..serializers import CreateCommentSerializer


class CreateComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateCommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"success": True, "message": "Comment created successfully"}, status=201
            )
        else:
            return Response(serializer.errors, status=400)


class DeleteComment(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()
    lookup_url_kwarg = "comment_id"

    def perform_destroy(self, instance):
        user = self.request.user
        if not (user.role == "admin" or instance.user == user):
            raise PermissionDenied("You are not allowed to delete this comment")

        instance.delete()
