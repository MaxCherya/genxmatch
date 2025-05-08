from django.contrib import admin
from .models import Order, OrderItem, DeliveryCompany

@admin.register(DeliveryCompany)
class DeliveryCompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'get_items',
        'quantity',
        'name',
        'surname',
        'patronymic',
        'get_delivery_company_name',
        'phone_number',
        'oblast',
        'city',
        'warehouse',
        'zipcode',
        'date',
        'status',
        'total_price_uah',
    )
    list_filter = ('date', 'oblast', 'city', 'status', 'delivery_company')
    search_fields = ('name', 'surname', 'patronymic', 'phone_number', 'oblast', 'city', 'warehouse')
    ordering = ('-date',)

    @admin.display(description='Items')
    def get_items(self, obj):
        items = obj.items.all()
        return ", ".join(item.item.name_eng for item in items) if items.exists() else "-"

    @admin.display(description='Delivery Company')
    def get_delivery_company_name(self, obj):
        return obj.delivery_company.name if obj.delivery_company else "-"