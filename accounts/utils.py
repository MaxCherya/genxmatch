from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
import qrcode
import io
import base64

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def generate_totp_secret():
    return pyotp.random_base32()

def generate_qr_code_uri(username, secret, issuer_name="GenXMatch"):
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=username, issuer_name=issuer_name)

def generate_qr_image_base64(uri):
    qr = qrcode.make(uri)
    buffered = io.BytesIO()
    qr.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

def verify_otp(secret, otp):
    totp = pyotp.TOTP(secret)
    return totp.verify(otp)