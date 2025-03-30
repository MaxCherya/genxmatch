from django.http import HttpResponsePermanentRedirect

class WwwRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host()

        if host == 'genxmatch.com.ua':
            return HttpResponsePermanentRedirect(f'https://www.genxmatch.com.ua{request.get_full_path()}')

        response = self.get_response(request)
        return response