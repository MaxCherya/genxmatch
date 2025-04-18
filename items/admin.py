from django.contrib import admin
from .models import Supplier, Item, ItemCharacteristic, Category

@admin.register(Category)
class Category(admin.ModelAdmin):
    list_display = ('id', 'name_eng')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(ItemCharacteristic)
class ItemCharacteristicAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'key_ua', 'key_eng', 'key_rus', 'value_ua', 'value_eng', 'value_rus')
    list_filter = ('item',)
    search_fields = ('key_ua', 'key_eng', 'key_rus', 'value_ua', 'value_eng', 'value_rus')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_eng', 'artiqul_original', 'supplier', 'price_uah')
    list_filter = ('supplier',)
    search_fields = ('name_eng', 'name_ua', 'name_rus', 'artiqul_original')