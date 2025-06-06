# Generated by Django 5.1.3 on 2025-05-08 10:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('items', '0014_item_rating_item_sold'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecentlyViewedItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('viewed_at', models.DateTimeField(auto_now=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='items.item')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recently_viewed_items', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-viewed_at'],
                'unique_together': {('user', 'item')},
            },
        ),
    ]
