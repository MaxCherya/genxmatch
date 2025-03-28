import logging
from two_factor.views import LoginView
from django.shortcuts import redirect
from django_otp.plugins.otp_totp.models import TOTPDevice

logger = logging.getLogger(__name__)

class CustomLoginView(LoginView):
    def post(self, request, *args, **kwargs):
        logger.debug(f"POST to login view. User authenticated: {request.user.is_authenticated}")
        return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        logger.debug(f"Form valid. User: {self.request.user}, Authenticated: {self.request.user.is_authenticated}")
        response = super().form_valid(form)
        user = self.request.user
        logger.debug(f"After form_valid. User: {user}, Authenticated: {user.is_authenticated}")
        if user.is_authenticated:
            devices = TOTPDevice.objects.filter(user=user, confirmed=True)
            logger.debug(f"Devices exist: {devices.exists()}")
            if not devices.exists():
                logger.debug("No 2FA device found, redirecting to setup.")
                return redirect('two_factor:setup')
        else:
            logger.warning("User not authenticated after form_valid.")
        return response

    def get_success_url(self):
        user = self.request.user
        if user.is_authenticated:
            devices = TOTPDevice.objects.filter(user=user, confirmed=True)
            if not devices.exists():
                logger.debug("No 2FA device in get_success_url, redirecting to setup.")
                return self.request.build_absolute_uri('/account/two_factor/setup/')
        success_url = super().get_success_url()
        logger.debug(f"Success URL: {success_url}")
        return success_url