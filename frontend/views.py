from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView

import logging
logger = logging.getLogger(__name__)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFAwareIndexView(TemplateView):
    template_name = "index.html"

    def get(self, request, *args, **kwargs):
        logger.info("Serving index.html with CSRF cookie")
        return super().get(request, *args, **kwargs)