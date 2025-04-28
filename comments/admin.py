from django.contrib import admin
from .models import ItemComment

@admin.register(ItemComment)
class ItemCommentAdmin(admin.ModelAdmin):
    list_display = ('item', 'name', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('name', 'surname', 'content')