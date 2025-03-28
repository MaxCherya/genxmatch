from django.contrib import admin
from .models import Supplier, Item

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_eng', 'artiqul_original', 'supplier', 'price_uah')
    list_filter = ('supplier',)
    search_fields = ('name_eng', 'name_ua', 'name_rus', 'artiqul_original')