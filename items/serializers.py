from rest_framework import serializers
from .models import Item, Category, ItemCharacteristic, Supplier

class ItemCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCharacteristic
        fields = ['key_ua', 'key_eng', 'key_rus', 'value_ua', 'value_eng', 'value_rus']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name']

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
            'artiqul_original', 'price_uah', 'old_price_uah',

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

class CatalogItemSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)

    class Meta:
        model = Item
        fields = [
            'id',
            'name_ua', 'name_eng', 'name_rus', 'price_uah','old_price_uah',

            'item_length', 'item_height', 'item_width', 'item_weight',

            'sold', 'rating',

            'main_image',
            'categories'
        ]

class ItemMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            'id',
            'name_ua', 'name_eng', 'name_rus',
            'short_description_ua', 'short_description_eng', 'short_description_rus',
            'artiqul_original',
            'main_image', 'price_uah', 'rating', 'sold'
        ]

class ItemCreateSerializer(serializers.Serializer):
    name_ua = serializers.CharField()
    name_eng = serializers.CharField()
    name_rus = serializers.CharField()
    artiqul = serializers.CharField()
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    sold = serializers.IntegerField()
    rating = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    price_original_uah = serializers.DecimalField(max_digits=10, decimal_places=2)
    price_uah = serializers.DecimalField(max_digits=10, decimal_places=2)
    min_price_uah = serializers.DecimalField(max_digits=10, decimal_places=2)
    old_price_uah = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)

    item_length = serializers.DecimalField(max_digits=10, decimal_places=2)
    item_height = serializers.DecimalField(max_digits=10, decimal_places=2)
    item_weight = serializers.DecimalField(max_digits=10, decimal_places=2)
    item_width = serializers.DecimalField(max_digits=10, decimal_places=2)

    short_description_ua = serializers.CharField(allow_blank=True)
    short_description_eng = serializers.CharField(allow_blank=True)
    short_description_rus = serializers.CharField(allow_blank=True)

    description_p1_ua = serializers.CharField(allow_blank=True)
    description_p1_eng = serializers.CharField(allow_blank=True)
    description_p1_rus = serializers.CharField(allow_blank=True)

    description_p2_ua = serializers.CharField(allow_blank=True)
    description_p2_eng = serializers.CharField(allow_blank=True)
    description_p2_rus = serializers.CharField(allow_blank=True)

    feature_header_1_ua = serializers.CharField(allow_blank=True)
    feature_header_1_eng = serializers.CharField(allow_blank=True)
    feature_header_1_rus = serializers.CharField(allow_blank=True)
    feature_1_ua = serializers.CharField(allow_blank=True)
    feature_1_eng = serializers.CharField(allow_blank=True)
    feature_1_rus = serializers.CharField(allow_blank=True)

    feature_header_2_ua = serializers.CharField(allow_blank=True)
    feature_header_2_eng = serializers.CharField(allow_blank=True)
    feature_header_2_rus = serializers.CharField(allow_blank=True)
    feature_2_ua = serializers.CharField(allow_blank=True)
    feature_2_eng = serializers.CharField(allow_blank=True)
    feature_2_rus = serializers.CharField(allow_blank=True)

    feature_header_3_ua = serializers.CharField(allow_blank=True)
    feature_header_3_eng = serializers.CharField(allow_blank=True)
    feature_header_3_rus = serializers.CharField(allow_blank=True)
    feature_3_ua = serializers.CharField(allow_blank=True)
    feature_3_eng = serializers.CharField(allow_blank=True)
    feature_3_rus = serializers.CharField(allow_blank=True)

    feature_header_4_ua = serializers.CharField(allow_blank=True)
    feature_header_4_eng = serializers.CharField(allow_blank=True)
    feature_header_4_rus = serializers.CharField(allow_blank=True)
    feature_4_ua = serializers.CharField(allow_blank=True)
    feature_4_eng = serializers.CharField(allow_blank=True)
    feature_4_rus = serializers.CharField(allow_blank=True)

    main_image_url = serializers.URLField(allow_blank=True)
    video_url = serializers.URLField(allow_blank=True)
    video_poster_url = serializers.URLField(allow_blank=True)

    gallery = serializers.ListField(child=serializers.DictField(), required=False)
    categories = serializers.ListField(child=serializers.IntegerField())
    characteristics = ItemCharacteristicSerializer(many=True)

    def create(self, validated_data):
        from django.db import transaction

        categories_ids = validated_data.pop("categories")
        characteristics_data = validated_data.pop("characteristics")
        gallery = validated_data.pop("gallery", [])

        with transaction.atomic():
            item = Item.objects.create(
                name_ua=validated_data["name_ua"],
                name_eng=validated_data["name_eng"],
                name_rus=validated_data["name_rus"],
                artiqul_original=validated_data["artiqul"],
                supplier=validated_data["supplier"],
                sold=validated_data["sold"],
                rating=validated_data.get("rating", 0),
                price_original_uah=validated_data["price_original_uah"],
                price_uah=validated_data["price_uah"],
                min_price_uah=validated_data["min_price_uah"],
                old_price_uah=validated_data.get("old_price_uah"),

                item_length=validated_data["item_length"],
                item_height=validated_data["item_height"],
                item_weight=validated_data["item_weight"],
                item_width=validated_data["item_width"],

                short_description_ua=validated_data["short_description_ua"],
                short_description_eng=validated_data["short_description_eng"],
                short_description_rus=validated_data["short_description_rus"],

                description_p1_ua=validated_data["description_p1_ua"],
                description_p1_eng=validated_data["description_p1_eng"],
                description_p1_rus=validated_data["description_p1_rus"],

                description_p2_ua=validated_data["description_p2_ua"],
                description_p2_eng=validated_data["description_p2_eng"],
                description_p2_rus=validated_data["description_p2_rus"],

                feature_1_header_ua=validated_data["feature_header_1_ua"],
                feature_1_header_eng=validated_data["feature_header_1_eng"],
                feature_1_header_rus=validated_data["feature_header_1_rus"],
                feature_1_ua=validated_data["feature_1_ua"],
                feature_1_eng=validated_data["feature_1_eng"],
                feature_1_rus=validated_data["feature_1_rus"],

                feature_2_header_ua=validated_data["feature_header_2_ua"],
                feature_2_header_eng=validated_data["feature_header_2_eng"],
                feature_2_header_rus=validated_data["feature_header_2_rus"],
                feature_2_ua=validated_data["feature_2_ua"],
                feature_2_eng=validated_data["feature_2_eng"],
                feature_2_rus=validated_data["feature_2_rus"],

                feature_3_header_ua=validated_data["feature_header_3_ua"],
                feature_3_header_eng=validated_data["feature_header_3_eng"],
                feature_3_header_rus=validated_data["feature_header_3_rus"],
                feature_3_ua=validated_data["feature_3_ua"],
                feature_3_eng=validated_data["feature_3_eng"],
                feature_3_rus=validated_data["feature_3_rus"],

                feature_4_header_ua=validated_data["feature_header_4_ua"],
                feature_4_header_eng=validated_data["feature_header_4_eng"],
                feature_4_header_rus=validated_data["feature_header_4_rus"],
                feature_4_ua=validated_data["feature_4_ua"],
                feature_4_eng=validated_data["feature_4_eng"],
                feature_4_rus=validated_data["feature_4_rus"],

                main_image=validated_data["main_image_url"],
                video=validated_data["video_url"],
                video_poster=validated_data["video_poster_url"],
                gallery=gallery
            )

            item.categories.set(categories_ids)

            for char_data in characteristics_data:
                ItemCharacteristic.objects.create(item=item, **char_data)

        return item