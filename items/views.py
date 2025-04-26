from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Max
from .models import Item, Category
from .serializers import ItemSerializer, CategorySerializer, CatalogItemSerializer
from .paginator import CatalogPagination
from django.utils.translation import gettext as _


class ItemListView(generics.ListAPIView):
    serializer_class = CatalogItemSerializer
    pagination_class = CatalogPagination

    def get_queryset(self):
        qs = Item.objects.all()

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price_uah__gte=min_price)
        if max_price:
            qs = qs.filter(price_uah__lte=max_price)

        categories = self.request.query_params.get("categories")
        if categories:
            category_ids = [int(cid) for cid in categories.split(",") if cid.isdigit()]
            qs = qs.filter(categories__id__in=category_ids).distinct()

        sort = self.request.query_params.get("sort")
        if sort == "price_asc":
            qs = qs.order_by("price_uah")
        elif sort == "price_desc":
            qs = qs.order_by("-price_uah")
        elif sort == "rating":
            qs = qs.order_by("-rating")
        elif sort == "popularity":
            qs = qs.order_by("-sold")

        return qs


class GetItem(APIView):
    def get(self, request, item_id):
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': _('Item not found')}, status=404)

        serializer = ItemSerializer(item)
        return Response(serializer.data)


class CatalogFiltersView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        max_price = Item.objects.aggregate(max_price=Max("price_uah"))["max_price"] or 1000
        return Response({
            "categories": CategorySerializer(categories, many=True).data,
            "max_price": max_price
        })