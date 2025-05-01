from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import AllowAny
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django_ratelimit.decorators import ratelimit

from .serializers import RegisterSerializer
from .utils import get_tokens_for_user

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def register(request):
    data = request.data

    if User.objects.filter(username=data.get('username')).exists():
        return Response({'error': _('Username is already taken.')}, status=400)

    if data.get('email') and User.objects.filter(email=data.get('email')).exists():
        return Response({'error': _('Email is already in use.')}, status=400)

    if len(data.get('password', '')) < 8:
        return Response({'error': _('Password must be at least 8 characters.')}, status=400)

    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        res = Response({'message': _('User registered')}, status=status.HTTP_201_CREATED)
        res.set_cookie('access', tokens['access'], httponly=True)
        res.set_cookie('refresh', tokens['refresh'], httponly=True)
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
        tokens = get_tokens_for_user(user)
        res = Response({'message': _('Login successful')}, status=status.HTTP_200_OK)
        res.set_cookie('access', tokens['access'], httponly=True)
        res.set_cookie('refresh', tokens['refresh'], httponly=True)
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
        res.set_cookie('access', access_token, httponly=True)
        return res

    except TokenError:
        return Response({'error': _('Invalid or expired refresh token.')}, status=401)