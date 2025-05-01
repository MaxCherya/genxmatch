from django.urls import path
from .views import ItemListView, CatalogFiltersView, GetItem, ItemSuggestionsView, search_items

urlpatterns = [
    path('items/', ItemListView.as_view(), name='item-list'),
    path('items/<int:item_id>/', GetItem.as_view(), name='get-item'),
    path('catalog/filters/', CatalogFiltersView.as_view(), name='catalog-filters'),
    path('items/<int:item_id>/suggestions/', ItemSuggestionsView.as_view(), name='item-suggestions'),
    path('catalog/search/', search_items, name='search_items'),
]