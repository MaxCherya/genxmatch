from rest_framework import serializers
from .models import ItemComment

class ItemCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemComment
        fields = ['id', 'item', 'name', 'surname', 'rating', 'content', 'images', 'created_at']
        read_only_fields = ['id', 'item']

    created_at = serializers.DateTimeField(required=False)