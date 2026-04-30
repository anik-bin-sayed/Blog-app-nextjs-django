import os

from django.core.wsgi import get_wsgi_application

ENV = os.getenv("ENV", "development")

if ENV == "production":
    settings_module = "blog_app.settings.production"
else:
    settings_module = "blog_app.settings.development"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_wsgi_application()
