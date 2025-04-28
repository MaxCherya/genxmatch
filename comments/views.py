from rest_framework import generics
from .models import ItemComment, Item
from .serializers import ItemCommentSerializer
from rest_framework.response import Response
from rest_framework import status
from items.utils import update_item_rating
from .pagination import CommentPagination
from ratelimit.decorators import ratelimit

class ItemCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemCommentSerializer
    pagination_class = CommentPagination

    @ratelimit(key='ip', rate='10/s', method='GET', block=True)
    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        return ItemComment.objects.filter(item_id=item_id).order_by('-created_at')

    @ratelimit(key='ip', rate='1/30s', method='POST', block=True)
    def create(self, request, *args, **kwargs):
        item_id = self.kwargs.get('item_id')
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({"error": "Item not found."}, status=404)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(item=item)
            update_item_rating(item)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
