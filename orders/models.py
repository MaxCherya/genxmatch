from django.db import models
from items.models import Item
from django.contrib.auth.models import User

class DeliveryCompany(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Order(models.Model):

    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    warehouse = models.TextField()
    delivery_company = models.ForeignKey(DeliveryCompany, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    order_special_id = models.IntegerField(null=True, blank=True, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders')

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and self.order_special_id is None:
            self.order_special_id = 100000 + self.id
            super().save(update_fields=['order_special_id'])

    def __str__(self):
        return f'{self.name} {self.surname} | {self.item.name_eng} | {self.date}'