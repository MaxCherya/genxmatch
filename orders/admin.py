from django.contrib import admin
from .models import Order, DeliveryCompany, NotificationOrdersEmails

@admin.register(NotificationOrdersEmails)
class DeliveryCompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'email')
    search_fields = ('email',)

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
        'get_delivery_company_name',
        'phone_number',
        'oblast',
        'city',
        'warehouse',
        'zipcode',
        'date',
    )
    list_filter = ('date', 'oblast', 'city', 'item')
    search_fields = ('name', 'surname', 'patronymic', 'phone_number', 'oblast', 'city', 'warehouse')
    ordering = ('-date',)

    @admin.display(description='Delivery Company')
    def get_delivery_company_name(self, obj):
        return obj.delivery_company.name if obj.delivery_company else "-"