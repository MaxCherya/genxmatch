from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django_ratelimit.decorators import ratelimit
from .models import CustomUser, RecentlyViewedItem
from django.conf import settings
from django.utils import timezone
from items.models import Item
from items.serializers import ItemMiniSerializer

from .serializers import RegisterSerializer, UserInformationSerializer
from .utils import get_tokens_for_user, generate_qr_code_uri, generate_qr_image_base64, generate_totp_secret, verify_otp


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def register(request):
    data = request.data

    if CustomUser.objects.filter(username=data.get('username')).exists():
        return Response({'error': _('Username is already taken.')}, status=400)

    if data.get('email') and CustomUser.objects.filter(email=data.get('email')).exists():
        return Response({'error': _('Email is already in use.')}, status=400)

    if len(data.get('password', '')) < 8:
        return Response({'error': _('Password must be at least 8 characters.')}, status=400)

    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        res = Response({'message': _('User registered')}, status=status.HTTP_201_CREATED)
        res.set_cookie('access', tokens['access'], **settings.COOKIE_SETTINGS)
        res.set_cookie('refresh', tokens['refresh'], **settings.COOKIE_SETTINGS)
        return res
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:

        if user.is_2fa_enabled:
            otp = request.data.get("otp")
            if not otp:
                return Response({'error': _('2FA OTP required.'), 'error_id': 'OTP_Enabled'}, status=403)
            if not verify_otp(user.totp_secret, otp):
                return Response({'error': _('Invalid OTP')}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        serializer = UserInformationSerializer(user)

        res = Response({
            'message': _('Login successful'),
            'user': serializer.data
        }, status=status.HTTP_200_OK)

        res.set_cookie('access', tokens['access'], **settings.COOKIE_SETTINGS)
        res.set_cookie('refresh', tokens['refresh'], **settings.COOKIE_SETTINGS)
        return res

    return Response({'error': _('Invalid credentials')}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='20/m', method='POST', block=True)
def logout(request):
    refresh_token = request.COOKIES.get('refresh')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass

    res = Response({'message': _('Logged out successfully.')}, status=200)
    res.delete_cookie('access')
    res.delete_cookie('refresh')
    return res


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='20/m', method='POST', block=True)
def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh')

    if not refresh_token:
        return Response({'error': _('Refresh token not found.')}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        res = Response({'message': _('Token refreshed')}, status=200)
        res.set_cookie('access', access_token['access'], **settings.COOKIE_SETTINGS)
        return res

    except TokenError:
        return Response({'error': _('Invalid or expired refresh token.')}, status=401)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def get_user(request):
    id = request.data.get('userId')
    if not id:
        return Response({'error': _('User is not found.')}, status=404)
    
    if id == 'me':
        user = request.user
    else:
        try:
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({'error': _('User is not found.')}, status=404)
    
    serializer = UserInformationSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ratelimit(key='ip', rate='30/m', method='GET', block=True)
def is_authenticated(request):
    return Response({'success': True})


@api_view(['GET'])
@permission_classes([IsAdminUser])
@ratelimit(key='ip', rate='30/m', method='GET', block=True)
def is_admin(request):
    return Response({'success': True})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def add_to_last_viewed(request):
    item_id = request.data.get('itemId')

    if not item_id:
        return Response({'error': _('itemId is required.')}, status=status.HTTP_400_BAD_REQUEST)

    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response({'error': _('Item not found.')}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Create or update the recently viewed record
    RecentlyViewedItem.objects.update_or_create(
        user=user,
        item=item,
        defaults={'viewed_at': timezone.now()}
    )

    # Trim to last 10 viewed items
    recent_items = RecentlyViewedItem.objects.filter(user=user).order_by('-viewed_at')
    if recent_items.count() > 10:
        for excess in recent_items[10:]:
            excess.delete()

    return Response({'message': _('Item added to last viewed.')}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='ip', rate='10/m', method='GET', block=True)
def get_last_viewed_items(request):
    user = request.user
    recently_viewed = RecentlyViewedItem.objects.filter(user=user).order_by('-viewed_at')[:10]
    items = [entry.item for entry in recently_viewed]

    # serialize items
    serialized = ItemMiniSerializer(items, many=True)
    return Response(serialized.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enable_2fa(request):
    user = request.user

    if user.is_2fa_enabled:
        return Response({
            "error": "2FA_ALREADY_ENABLED",
            "message": _("Two-factor authentication is already enabled.")
        }, status=400)

    secret = generate_totp_secret()
    uri = generate_qr_code_uri(user.username, secret)
    qr_base64 = generate_qr_image_base64(uri)

    user.totp_secret = secret
    user.save()

    return Response({
        'message': _('Scan this QR code or enter the manual code. Then confirm with an OTP.'),
        'qr_code': qr_base64,
        'manual_code': secret,
    }, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_2fa(request):
    user = request.user
    otp = request.data.get('otp')

    if not user.totp_secret:
        return Response({'error': _('2FA setup not initiated.')}, status=400)

    if not otp or not verify_otp(user.totp_secret, otp):
        return Response({'error': _('Invalid OTP.')}, status=400)

    user.is_2fa_enabled = True
    user.save()

    return Response({'message': _('2FA has been enabled.')}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disable_2fa(request):
    user = request.user
    otp = request.data.get('otp')

    if not user.is_2fa_enabled:
        return Response({'error': _('2FA is not enabled.')}, status=400)

    if not otp or not verify_otp(user.totp_secret, otp):
        return Response({'error': _('Invalid OTP.')}, status=400)

    user.is_2fa_enabled = False
    user.totp_secret = None
    user.save()

    return Response({'message': _('2FA has been disabled.')}, status=200)