from django.core.management.base import BaseCommand
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from django.utils import timezone


class Command(BaseCommand):
    help = 'Deletes expired JWT tokens from the blacklist/outstanding tables.'

    def handle(self, *args, **options):
        now = timezone.now()
        expired_tokens = OutstandingToken.objects.filter(expires_at__lt=now)
        count = expired_tokens.count()
        expired_tokens.delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {count} expired tokens.'))