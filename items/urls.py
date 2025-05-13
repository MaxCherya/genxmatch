from django.urls import path
from .views import ItemListView, CatalogFiltersView, GetItem, ItemSuggestionsView, search_items, get_suppliers, get_categories, create_item

urlpatterns = [
    path('items/', ItemListView.as_view(), name='item-list'),
    path('items/<int:item_id>/', GetItem.as_view(), name='get-item'),
    path('catalog/filters/', CatalogFiltersView.as_view(), name='catalog-filters'),
    path('items/<int:item_id>/suggestions/', ItemSuggestionsView.as_view(), name='item-suggestions'),
    path('catalog/search/', search_items, name='search_items'),

    # potato
    path('potato/get-suppliers/', get_suppliers, name='get_suppliers'),
    path('potato/get-categories/', get_categories, name='get_categories'),
    path('potato/create-item/', create_item, name='create_item')
]