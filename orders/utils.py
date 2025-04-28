from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.contrib.auth.models import Group
import hashlib
import hmac
import time

def verify_signature(items, timestamp, provided_signature, max_age_seconds=60):
    try:
        # Validate timestamp
        timestamp = int(timestamp)
        current_time = int(time.time())
        if abs(current_time - timestamp) > max_age_seconds:
            return False

        # Build message
        items_string = ";".join(
            f"{str(item['item_id'])}:{str(item['quantity'])}" for item in items
        )
        message = f"{items_string}:{timestamp}".encode("utf-8")

        secret = settings.HMAC_SECRET_KEY.encode("utf-8")
        expected_signature = hmac.new(secret, message, hashlib.sha256).hexdigest()

        return hmac.compare_digest(expected_signature, provided_signature)

    except Exception as e:
        print('[ERROR in verify_signature]', e)
        return False
    
def send_notification_email(order):
    try:
        orders_dep_group = Group.objects.get(name="Orders Dep")
    except Group.DoesNotExist:
        return

    recipient_emails = [user.email for user in orders_dep_group.user_set.all() if user.email]
    if not recipient_emails:
        return

    if not recipient_emails:
        return

    subject = f"🛒 New Order #{order.order_special_id} Received"
    html_message = render_to_string("emails/order_notification.html", {"order": order})

    email = EmailMessage(
        subject=subject,
        body=html_message,
        from_email=None,
        to=recipient_emails,
    )
    email.content_subtype = "html"
    email.send(fail_silently=False)