from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Max
from django.utils.translation import gettext as _
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .models import Item, Category
from .serializers import ItemSerializer, CategorySerializer, CatalogItemSerializer
from .paginator import CatalogPagination
from rest_framework import generics


class ItemListView(generics.ListAPIView):
    serializer_class = CatalogItemSerializer
    pagination_class = CatalogPagination

    @method_decorator(ratelimit(key='ip', rate='5/s', method='GET', block=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        qs = Item.objects.all()

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price is not None:
            qs = qs.filter(price_uah__gte=min_price)
        if max_price is not None:
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
    @method_decorator(ratelimit(key='ip', rate='10/s', method='GET', block=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request, item_id):
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': _('Item not found.')}, status=404)

        serializer = ItemSerializer(item)
        return Response(serializer.data)


class CatalogFiltersView(APIView):
    @method_decorator(ratelimit(key='ip', rate='2/s', method='GET', block=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        categories = Category.objects.all()
        max_price = Item.objects.aggregate(max_price=Max("price_uah"))["max_price"] or 1000
        return Response({
            "categories": CategorySerializer(categories, many=True).data,
            "max_price": max_price
        })


class ItemSuggestionsView(APIView):
    @method_decorator(ratelimit(key='ip', rate='3/s', method='GET', block=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request, item_id):
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': _('Item not found.')}, status=404)

        categories = item.categories.all()
        if not categories.exists():
            return Response([], status=200)

        suggestions = (
            Item.objects.filter(categories__in=categories)
            .exclude(id=item.id)
            .distinct()
            .order_by('-sold')[:8]
        )

        serializer = CatalogItemSerializer(suggestions, many=True)
        return Response(serializer.data)