import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator
from django.conf import settings
from django.core.asgi import get_asgi_application

ENV = os.getenv("ENV", "development")

if ENV == "production":
    settings_module = "blog_app.settings.production"
else:
    settings_module = "blog_app.settings.development"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

django_asgi_app = get_asgi_application()

from account.authentication import CookieJWTAuthMiddleware
from blog.routing import websocket_urlpatterns as blog_websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": OriginValidator(
            CookieJWTAuthMiddleware(URLRouter(blog_websocket_urlpatterns)),
            settings.CORS_ALLOWED_ORIGINS,
        ),
    }
)
