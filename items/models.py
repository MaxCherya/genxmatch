from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Item(models.Model):
    name_ua = models.TextField()
    name_eng = models.TextField()
    name_rus = models.TextField()
    artiqul_original = models.CharField(max_length=255)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='items')
    price_original_uah = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_uah = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name_eng
