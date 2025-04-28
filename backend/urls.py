"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from frontend.views import CSRFAwareIndexView
from django.views.static import serve
from two_factor import urls as two_factor_urls
from custom_auth.views import CustomLoginView

from two_factor.admin import AdminSiteOTPRequired
admin.site.__class__ = AdminSiteOTPRequired

urlpatterns = [
    path("admin/", admin.site.urls),
    path("account/login/", CustomLoginView.as_view(), name="login"),
    path("", include(two_factor_urls.urlpatterns)),
    path("api/items/", include("items.urls")),
    path("api/comments/", include("comments.urls")),
    path('orders/', include('orders.urls')),

    # ✅ Serve Static Files (JS, CSS, Images)
    re_path(r"^assets/(?P<path>.*)$", serve, {"document_root": settings.STATICFILES_DIRS[1]}),

    # ✅ Serve React's index.html for frontend routes
    path("", CSRFAwareIndexView.as_view(), name="home"),
    re_path(r"^(?!admin/|account/|api/|orders/).*", CSRFAwareIndexView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])