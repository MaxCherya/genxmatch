from django.conf import settings
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