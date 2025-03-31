from django_ratelimit.decorators import ratelimit
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json

from items.models import Item
from .models import Order, DeliveryCompany

from django.utils.translation import gettext as _

@require_POST
@ratelimit(key='ip', rate='10/m', block=True)
def place_an_order(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        if username:
            print('[SECURITY] Bot detected: Honeypot triggered.')
            return JsonResponse({'error': _('Suspicious activity')}, status=400)

        item_id = data.get("item_id")
        quantity = int(data.get("quantity", 1))
        name = data.get("name", "").strip()
        surname = data.get("surname", "").strip()
        phone = data.get("phone")
        oblast = data.get("oblast")
        city = data.get("city")
        warehouse = data.get("warehouse")
        delivery_company_id = data.get("delivery_company_id")

        if not all([item_id, quantity, name, surname, phone, oblast, city, warehouse, delivery_company_id]):
            return JsonResponse({"error": _("All fields are required.")}, status=400)
        
        if len(name) > 255 or len(surname) > 255:
            return JsonResponse({"error": _("Name or surname too long.")}, status=400)
        
        if len(oblast) > 255 or len(city) > 255:
            return JsonResponse({"error": _("Oblast or city names are too long.")}, status=400)

        if not phone or len(phone) < 10 or len(phone) > 20:
            return JsonResponse({"error": _("Invalid phone number.")}, status=400)

        if quantity < 1 or quantity > 1000:
            return JsonResponse({"error": _("Invalid quantity.")}, status=400)
        
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return JsonResponse({"error": _("Invalid item")}, status=404)
        
        try:
            delivery_company = DeliveryCompany.objects.get(id=delivery_company_id)
        except DeliveryCompany.DoesNotExist:
            return JsonResponse({'error': _('Invalid Delivering Company')})
        
        order = Order.objects.create(
            item=item,
            quantity=quantity,
            name=name,
            surname=surname,
            phone_number=phone,
            oblast=oblast,
            city=city,
            warehouse=warehouse,
            delivery_company=delivery_company,
            status='new'
        )

        return JsonResponse({'success': True, "order_id": order.order_special_id}, status=201)
    
    except Exception as e:
        return JsonResponse({"error": _("Server error")}, status=500)