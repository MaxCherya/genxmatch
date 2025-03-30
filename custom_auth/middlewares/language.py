from django.utils import translation
from django.shortcuts import redirect

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        LANGUAGE_MAP = {
            'ukr': 'uk',
            'eng': 'en',
            'rus': 'ru',
        }

        lang_param = request.GET.get('lang')
        lang_cookie = request.COOKIES.get('preferred_lang')
        raw_lang = (
            lang_param or
            lang_cookie or
            request.headers.get('X-Language') or
            request.META.get('HTTP_ACCEPT_LANGUAGE', '')
        ).lower()

        short_lang = raw_lang.split(',')[0].strip()[:3]
        lang_code = LANGUAGE_MAP.get(short_lang, 'uk')

        translation.activate(lang_code)
        request.LANGUAGE_CODE = lang_code

        response = self.get_response(request)

        if lang_param:
            response.set_cookie('preferred_lang', lang_param, max_age=31536000)

        translation.deactivate()
        return response