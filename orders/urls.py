from django.urls import path
from . import views

urlpatterns = [
    path('place-an-order/', views.place_an_order, name='place_an_order'),
    path('sign-order/', views.sign_order, name="sign_order")
]