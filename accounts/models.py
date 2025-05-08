from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField 
from items.models import Item
from django.db import models

class RecentlyViewedItem(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='recently_viewed_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'item')
        ordering = ['-viewed_at']

class CustomUser(AbstractUser):
    last_viewed = ArrayField(base_field=models.IntegerField(), size=5, default=list, blank=True)