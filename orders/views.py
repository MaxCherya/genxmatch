from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json

from items.models import Item
from .models import Order

@require_POST
def place_an_order(request):
    try:
        data = json.loads(request.body)

        item_id = data.get("item_id")
        quantity = int(data.get("quantity", 1))
        name = data.get("name", "").strip()
        surname = data.get("surname", "").strip()
        phone = data.get("phone")
        city = data.get("city")
        warehouse = data.get("warehouse")

        if not all([item_id, quantity, name, surname, phone, city, warehouse]):
            return JsonResponse({"error": "All fields are required."}, status=400)
        
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return JsonResponse({"error": "Invalid item"}, status=404)
        
        order = Order.objects.create(
            item=item,
            quantity=quantity,
            name=name,
            surname=surname,
            phone_number=phone,
            city=city,
            warehouse=warehouse,
        )

        return JsonResponse({'success': True, "order_id": order.id}, status=201)
    
    except Exception as e:
        return JsonResponse({"error": "Server error"}, status=500)