from .base import *

DEBUG = False

ALLOWED_HOSTS = ["yourdomain.com"]

CORS_ALLOWED_ORIGINS = [
    "https://yourfrontend.com",
]

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
