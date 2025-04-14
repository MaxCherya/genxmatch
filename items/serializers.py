from rest_framework import serializers
from .models import Item, Category, ItemCharacteristic

class ItemCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCharacteristic
        fields = ['key_ua', 'key_eng', 'key_rus', 'value_ua', 'value_eng', 'value_rus']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class ItemSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    characteristics = ItemCharacteristicSerializer(many=True, source='characteristics.all')

    class Meta:
        model = Item
        fields = [
            'id', 'name_ua', 'name_eng', 'name_rus', 'price_uah', 'main_image', 'categories', 'characteristics'
        ]