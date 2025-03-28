from django.db import models
from items.models import Item

class DeliveryCompany(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Order(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    warehouse = models.TextField()
    delivery_company = models.ForeignKey(DeliveryCompany, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)

    def __str__(self):
        return f'{self.name} {self.surname} | {self.item.name_eng} | {self.date}'