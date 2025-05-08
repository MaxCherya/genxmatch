from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField 
from django.db import models

class CustomUser(AbstractUser):
    last_viewed = ArrayField(base_field=models.IntegerField(), size=5, default=list, blank=True)

    def add_viewed_item(self, item_id:int):
        if self.last_viewed is None:
            self.last_viewed = []

        if item_id in self.last_viewed:
            self.last_viewed.remove(item_id)

        self.last_viewed.insert(0, item_id)

        if len(self.last_viewed) > 10:
            self.last_viewed = self.last_viewed[:10]

        self.save()