from django.urls import path
from accounts import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('refresh/', views.refresh_token, name='refresh'),
    path('logout/', views.logout, name='logout'),
    path('get-user/', views.get_user, name='get-user'),

    path('add-to-last-viewed/', views.add_to_last_viewed, name='add_to_last_viewed'),
    path('get-last-viewed-items/', views.get_last_viewed_items, name='get_last_viewed_items')
]