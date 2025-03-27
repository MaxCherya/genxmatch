from django.db import models
from items.models import Item

class Order(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    warehouse = models.TextField()