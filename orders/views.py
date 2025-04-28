import json
import hashlib
import hmac
import time
from django.db.models import F

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils.translation import gettext as _
from django_ratelimit.decorators import ratelimit

from items.models import Item
from .models import Order, DeliveryCompany, OrderItem
from .utils import verify_signature, send_notification_email


@require_POST
@ratelimit(key='ip', rate='20/m', block=True)
def sign_order(request):
    try:
        data = json.loads(request.body)
        items = data.get("items", [])
        timestamp = str(data.get("timestamp"))

        if not items or not isinstance(items, list):
            return JsonResponse({"error": "Invalid items list."}, status=400)

        # Build the message: item_id:quantity;item_id:quantity;...:timestamp
        items_string = ";".join(
            f"{str(item['item_id'])}:{str(item['quantity'])}" for item in items
        )
        message = f"{items_string}:{timestamp}".encode("utf-8")

        secret = settings.HMAC_SECRET_KEY.encode("utf-8")
        signature = hmac.new(secret, message, hashlib.sha256).hexdigest()

        return JsonResponse({"signature": signature})

    except Exception as e:
        print('[ERROR in sign_order]', e)
        return JsonResponse({"error": "Failed to sign"}, status=400)


@require_POST
@ratelimit(key='ip', rate='10/m', block=True)
def place_an_order(request):
    try:
        data = json.loads(request.body)

        # Honeypot bot detection
        if data.get("username"):
            print('[SECURITY] Bot detected: Honeypot triggered.')
            return JsonResponse({'error': _('Suspicious activity')}, status=400)

        items = data.get("items", [])
        if not items or not isinstance(items, list):
            return JsonResponse({'error': _('No items provided')}, status=400)

        name = data.get("name", "").strip()
        surname = data.get("surname", "").strip()
        patronymic = data.get("patronymic", "").strip()
        phone = data.get("phone", "").strip()
        oblast = data.get("oblast", "").strip()
        city = data.get("city", "").strip()
        zipcode = data.get('zipcode', "").strip()
        warehouse = data.get("warehouse", "").strip()
        delivery_company_id = data.get("delivery_company_id")
        customer_notes = data.get("customer_notes", "").strip()
        timestamp = str(data.get("timestamp"))
        signature = str(data.get("signature"))

        if not delivery_company_id:
            return JsonResponse({'error': _('Invalid delivering company.')}, status=400)

        try:
            delivery_company = DeliveryCompany.objects.get(id=delivery_company_id)
        except DeliveryCompany.DoesNotExist:
            return JsonResponse({'error': _('Invalid delivering company.')}, status=400)

        # Validate fields based on delivery company
        if delivery_company.name == 'Nova Poshta':
            if not all([name, surname, phone, oblast, city, warehouse]):
                return JsonResponse({"error": _("All fields are required.")}, status=400)
        elif delivery_company.name == 'Ukrposhta':
            if not all([name, surname, patronymic, phone, city, zipcode]):
                return JsonResponse({"error": _("All fields are required.")}, status=400)
            if len(patronymic) > 255:
                return JsonResponse({'error': _("Patronymic is too long.")}, status=400)
            if len(zipcode) > 255:
                return JsonResponse({'error': _("Zip-code is too long.")}, status=400)

        # General field validations
        if len(name) > 255 or len(surname) > 255:
            return JsonResponse({'error': _("Name or surname too long.")}, status=400)
        if oblast and len(oblast) > 255:
            return JsonResponse({'error': _("Oblast name too long.")}, status=400)
        if city and len(city) > 255:
            return JsonResponse({'error': _("City name too long.")}, status=400)
        if not phone or len(phone) < 10 or len(phone) > 20:
            return JsonResponse({'error': _("Invalid phone number.")}, status=400)

        # ✅ VERIFY FULL CART SIGNATURE
        if not verify_signature(items, timestamp, signature):
            return JsonResponse({"error": _('Invalid signature')}, status=403)

        # Create the order
        total_quantity = sum(int(item_data.get('quantity', 1)) for item_data in items)
        order = Order.objects.create(
            quantity=total_quantity,
            name=name,
            surname=surname,
            patronymic=patronymic,
            phone_number=phone,
            oblast=oblast,
            city=city,
            zipcode=zipcode,
            warehouse=warehouse,
            delivery_company=delivery_company,
            customer_notes=customer_notes,
            status='new'
        )

        # Attach order items and calculate total price
        total_price = 0
        for item_data in items:
            item_id = item_data.get("item_id")
            quantity = int(item_data.get("quantity", 1))

            try:
                item = Item.objects.get(id=item_id)
            except Item.DoesNotExist:
                return JsonResponse({'error': _("Invalid item.")}, status=404)

            if quantity < 1 or quantity > 1000:
                return JsonResponse({'error': _("Invalid quantity.")}, status=400)

            OrderItem.objects.create(
                order=order,
                item=item,
                quantity=quantity
            )

            Item.objects.filter(id=item.id).update(sold=F('sold') + quantity)
            total_price += item.price_uah * quantity

        order.total_price_uah = total_price
        order.save()

        send_notification_email(order)

        return JsonResponse({
            'success': True,
            'order_id': order.order_special_id,
            'order_total': float(total_price),
            'currency': 'UAH'
        }, status=201)

    except Exception as e:
        print('[ERROR in place_an_order]', e)
        return JsonResponse({"error": _("Server error")}, status=500)