from django.db.models import Avg

def update_item_rating(item):
    average = item.comments.aggregate(avg_rating=Avg('rating'))['avg_rating']
    item.rating = average if average else 0
    item.save(update_fields=['rating'])