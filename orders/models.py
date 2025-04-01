from django.db import models
from items.models import Item
from django.contrib.auth.models import User
from pgcrypto.fields import TextPGPSymmetricKeyField

class NotificationOrdersEmails(models.Model):
    email = TextPGPSymmetricKeyField(max_length=255)

    def __str__(self):
        return self.email

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
    name = TextPGPSymmetricKeyField(max_length=255)
    surname = TextPGPSymmetricKeyField(max_length=255)
    patronymic = TextPGPSymmetricKeyField(max_length=255, null=True, blank=True)
    phone_number = TextPGPSymmetricKeyField(max_length=255)
    oblast = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=255, null=True, blank=True)
    warehouse = models.TextField(null=True, blank=True)
    customer_notes = models.TextField(null=True, blank=True)
    delivery_company = models.ForeignKey(DeliveryCompany, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    order_special_id = models.IntegerField(null=True, blank=True, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders')
    total_price_uah = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and self.order_special_id is None:
            self.order_special_id = 100000 + self.id
            super().save(update_fields=['order_special_id'])

    def __str__(self):
        return f'{self.name} {self.surname} | {self.item.name_eng} | {self.date}'