from django.urls import path
from .views import ItemListView, CatalogFiltersView

urlpatterns = [
    path('items/', ItemListView.as_view(), name='item-list'),
    path('catalog/filters/', CatalogFiltersView.as_view(), name='catalog-filters'),
]