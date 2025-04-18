from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name_eng = models.CharField(max_length=255)
    name_ua = models.CharField(max_length=255)
    name_rus = models.CharField(max_length=255)
    description_eng = models.TextField(blank=True, null=True)
    description_ua = models.TextField(blank=True, null=True)
    description_rus = models.TextField(blank=True, null=True)

    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='subcategories',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name_eng

class ItemCharacteristic(models.Model):
    item = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='characteristics')
    key_ua = models.CharField(max_length=255)
    key_eng = models.CharField(max_length=255)
    key_rus = models.CharField(max_length=255)
    value_ua = models.CharField(max_length=255)
    value_eng = models.CharField(max_length=255)
    value_rus = models.CharField(max_length=255)

class Item(models.Model):
    name_ua = models.TextField()
    name_eng = models.TextField()
    name_rus = models.TextField()

    artiqul_original = models.CharField(max_length=255)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='items')

    price_original_uah = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_uah = models.DecimalField(max_digits=10, decimal_places=2)
    min_price_uah = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    short_description_ua = models.TextField(blank=True, null=True)
    short_description_eng = models.TextField(blank=True, null=True)
    short_description_rus = models.TextField(blank=True, null=True)

    description_p1_ua = models.TextField(blank=True, null=True)
    description_p1_eng = models.TextField(blank=True, null=True)
    description_p1_rus = models.TextField(blank=True, null=True)

    description_p2_ua = models.TextField(blank=True, null=True)
    description_p2_eng = models.TextField(blank=True, null=True)
    description_p2_rus = models.TextField(blank=True, null=True)

    feature_1_header_ua = models.TextField(blank=True, null=True)
    feature_1_header_eng = models.TextField(blank=True, null=True)
    feature_1_header_rus = models.TextField(blank=True, null=True)
    feature_1_ua = models.TextField(blank=True, null=True)
    feature_1_eng = models.TextField(blank=True, null=True)
    feature_1_rus = models.TextField(blank=True, null=True)

    feature_2_header_ua = models.TextField(blank=True, null=True)
    feature_2_header_eng = models.TextField(blank=True, null=True)
    feature_2_header_rus = models.TextField(blank=True, null=True)
    feature_2_ua = models.TextField(blank=True, null=True)
    feature_2_eng = models.TextField(blank=True, null=True)
    feature_2_rus = models.TextField(blank=True, null=True)

    feature_3_header_ua = models.TextField(blank=True, null=True)
    feature_3_header_eng = models.TextField(blank=True, null=True)
    feature_3_header_rus = models.TextField(blank=True, null=True)
    feature_3_ua = models.TextField(blank=True, null=True)
    feature_3_eng = models.TextField(blank=True, null=True)
    feature_3_rus = models.TextField(blank=True, null=True)

    feature_4_header_ua = models.TextField(blank=True, null=True)
    feature_4_header_eng = models.TextField(blank=True, null=True)
    feature_4_header_rus = models.TextField(blank=True, null=True)
    feature_4_ua = models.TextField(blank=True, null=True)
    feature_4_eng = models.TextField(blank=True, null=True)
    feature_4_rus = models.TextField(blank=True, null=True)

    main_image = models.URLField(blank=True, null=True)
    gallery = models.JSONField(blank=True, null=True, default=list)
    video = models.URLField(blank=True, null=True)
    video_poster = models.URLField(blank=True, null=True)

    categories = models.ManyToManyField(Category, related_name='items', blank=True)

    def __str__(self):
        return self.name_eng