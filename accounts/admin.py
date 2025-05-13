from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_2fa_enabled', 'last_login')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_2fa_enabled')
    search_fields = ('username', 'email')

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('last_viewed', 'is_2fa_enabled', 'totp_secret'),
        }),
    )