from django.urls import path
from .views import ItemCommentListCreateView

urlpatterns = [
    path('<int:item_id>/comments/', ItemCommentListCreateView.as_view(), name='item-comments'),
]