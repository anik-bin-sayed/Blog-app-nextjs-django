import os

from .base import *

DEBUG = os.getenv("DEBUG", "0").lower() in ("1", "true", "yes")

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS", "http://localhost:3000"
    ).split(",")
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True

# SQLite path inside container (persisted via docker volume)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "data" / "db.sqlite3",
    }
}

SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "false").lower() in (
    "1",
    "true",
    "yes",
)
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "false").lower() in (
    "1",
    "true",
    "yes",
)
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE", "false").lower() in (
    "1",
    "true",
    "yes",
)

# JWT httpOnly cookies (login / refresh)
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() in (
    "1",
    "true",
    "yes",
)

# Trust reverse proxy (nginx, traefik, cloud load balancer)
if os.getenv("USE_X_FORWARDED_HOST", "false").lower() in ("1", "true", "yes"):
    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
