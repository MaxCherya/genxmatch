from django.db.models import Avg
from rest_framework.pagination import PageNumberPagination

def update_item_rating(item):
    average = item.comments.aggregate(avg_rating=Avg('rating'))['avg_rating']
    item.rating = average if average else 0
    item.save(update_fields=['rating'])

class SearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'