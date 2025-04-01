from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.contrib.auth.models import Group
import hashlib
import hmac
import time

def verify_signature(item_id, quantity, timestamp, provided_signature, max_age_seconds=60):
    try:
        # Convert timestamp to int and check expiration
        timestamp = int(timestamp)
        current_time = int(time.time())
        if abs(current_time - timestamp) > max_age_seconds:
            return False

        # Build HMAC
        message = f"{item_id}:{quantity}:{timestamp}".encode("utf-8")
        secret = settings.HMAC_SECRET_KEY.encode("utf-8")
        expected_signature = hmac.new(secret, message, hashlib.sha256).hexdigest()

        return hmac.compare_digest(expected_signature, provided_signature)
    except Exception:
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