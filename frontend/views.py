from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFAwareIndexView(TemplateView):
    template_name = "index.html"