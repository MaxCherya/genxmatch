# Generated by Django 5.1.3 on 2025-04-30 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemcomment',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]
