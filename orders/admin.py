from django.contrib import admin
from .models import Order, DeliveryCompany

@admin.register(DeliveryCompany)
class DeliveryCompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'item',
        'quantity',
        'name',
        'surname',
        'patronymic',
        'phone_number',
        'oblast',
        'city',
        'warehouse',
        'date',
    )
    list_filter = ('date', 'oblast', 'city', 'item')
    search_fields = ('name', 'surname', 'patronymic', 'phone_number', 'oblast', 'city', 'warehouse')
    ordering = ('-date',)