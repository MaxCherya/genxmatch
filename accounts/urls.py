from django.urls import path
from accounts import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('refresh/', views.refresh_token, name='refresh'),
    path('logout/', views.logout, name='logout'),
    path('get-user/', views.get_user, name='get-user'),

    path('is-auth/', views.is_authenticated, name='is_authenticated'),
    path('is-potato/', views.is_admin, name='is_admin'),

    path('add-to-last-viewed/', views.add_to_last_viewed, name='add_to_last_viewed'),
    path('get-last-viewed-items/', views.get_last_viewed_items, name='get_last_viewed_items'),

    path('2fa/enable/', views.enable_2fa, name='enable_2fa'),
    path('2fa/confirm/', views.confirm_2fa, name='confirm_2fa'),
    path('2fa/disable/', views.disable_2fa, name='disable_2fa'),
]