from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .models import ItemComment, Item
from .serializers import ItemCommentSerializer
from items.utils import update_item_rating
from .pagination import CommentPagination

class ItemCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemCommentSerializer
    pagination_class = CommentPagination

    @method_decorator(ratelimit(key='ip', rate='10/s', method=['GET', 'POST'], block=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        return ItemComment.objects.filter(item_id=item_id).order_by('-created_at')

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