from django.db import models
from items.models import Item

class ItemComment(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    content = models.TextField()
    images = models.JSONField(blank=True, null=True, default=list)
    created_at = models.DateTimeField()

    def __str__(self):
        return f"Comment by {self.name} on {self.item.name_eng}"