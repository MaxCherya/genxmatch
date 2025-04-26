from rest_framework import serializers
from .models import Item, Category, ItemCharacteristic

class ItemCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCharacteristic
        fields = ['key_ua', 'key_eng', 'key_rus', 'value_ua', 'value_eng', 'value_rus']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name_eng', 'name_ua', 'name_rus',
            'description_eng', 'description_ua', 'description_rus',
            'subcategories'
        ]

    def get_subcategories(self, obj):
        subcats = obj.subcategories.all()
        return CategorySerializer(subcats, many=True).data

class ItemSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    characteristics = ItemCharacteristicSerializer(many=True, source='characteristics.all')

    class Meta:
        model = Item
        fields = [
            'id',
            'name_ua', 'name_eng', 'name_rus',
            'artiqul_original', 'supplier',
            'price_original_uah', 'price_uah', 'min_price_uah', 'old_price_uah',

            'item_length', 'item_height', 'item_width', 'item_weight',

            'sold', 'rating',

            'short_description_ua', 'short_description_eng', 'short_description_rus',
            'description_p1_ua', 'description_p1_eng', 'description_p1_rus',
            'description_p2_ua', 'description_p2_eng', 'description_p2_rus',

            'feature_1_header_ua', 'feature_1_header_eng', 'feature_1_header_rus',
            'feature_1_ua', 'feature_1_eng', 'feature_1_rus',

            'feature_2_header_ua', 'feature_2_header_eng', 'feature_2_header_rus',
            'feature_2_ua', 'feature_2_eng', 'feature_2_rus',

            'feature_3_header_ua', 'feature_3_header_eng', 'feature_3_header_rus',
            'feature_3_ua', 'feature_3_eng', 'feature_3_rus',

            'feature_4_header_ua', 'feature_4_header_eng', 'feature_4_header_rus',
            'feature_4_ua', 'feature_4_eng', 'feature_4_rus',

            'main_image', 'gallery', 'video', 'video_poster',
            'categories', 'characteristics',
        ]