from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import math

class CatalogPagination(PageNumberPagination):
    page_size = 12  # or your default
    page_size_query_param = "page_size"  # optional, for flexibility

    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.get_page_size(self.request))
        return Response({
            "count": self.page.paginator.count,
            "total_pages": total_pages,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })