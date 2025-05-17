from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Max
from django.utils.translation import gettext as _
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .models import Item, Category, Supplier
from rest_framework.permissions import IsAdminUser
from .serializers import ItemSerializer, CategorySerializer, CatalogItemSerializer, ItemMiniSerializer, SupplierSerializer, ItemCreateSerializer
from .paginator import CatalogPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.db.models import Q
from rest_framework import generics
from .utils import SearchPagination


class ItemListView(generics.ListAPIView):
    serializer_class = CatalogItemSerializer
    pagination_class = CatalogPagination

    def get_queryset(self):
        qs = Item.objects.all()

        # filters
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
    

@api_view(['GET'])
def search_items(request):
    query = request.GET.get('q', '').strip()

    if len(query) < 2:
        return Response({'results': [], 'count': 0})

    filters = (
        Q(name_ua__icontains=query) |
        Q(name_eng__icontains=query) |
        Q(name_rus__icontains=query) |
        Q(short_description_ua__icontains=query) |
        Q(short_description_eng__icontains=query) |
        Q(short_description_rus__icontains=query) |
        Q(artiqul_original__icontains=query)
    )

    queryset = Item.objects.filter(filters).order_by('-rating')

    paginator = SearchPagination()
    paginated_qs = paginator.paginate_queryset(queryset, request)

    serializer = ItemMiniSerializer(paginated_qs, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_suppliers(request):
    data = Supplier.objects.all()
    serialized = SupplierSerializer(data, many=True)
    return Response(serialized.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_categories(request):
    data = Category.objects.all()
    serialized = CategorySerializer(data, many=True)
    return Response(serialized.data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_item(request):
    serializer = ItemCreateSerializer(data=request.data)
    if serializer.is_valid():
        item = serializer.save()
        return Response({"id": item.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)