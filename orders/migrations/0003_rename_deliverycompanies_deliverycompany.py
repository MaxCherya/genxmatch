# Generated by Django 5.0.13 on 2025-03-28 10:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_deliverycompanies_order_delivery_company'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='DeliveryCompanies',
            new_name='DeliveryCompany',
        ),
    ]
