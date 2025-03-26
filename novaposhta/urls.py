from django.urls import path
from . import views

urlpatterns = [
    path('cities/', views.get_cities, name='np_cities'),
    path('warehouses/', views.get_warehouses, name='np_warehouses'),
]