from rest_framework.pagination import PageNumberPagination

class CommentPagination(PageNumberPagination):
    page_size = 5  # Comments per page
    page_size_query_param = 'page_size'
    max_page_size = 50