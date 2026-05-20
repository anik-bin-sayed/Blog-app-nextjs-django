#!/bin/sh
set -e

cd /app/blog_app

mkdir -p data staticfiles media

python manage.py migrate --noinput

exec "$@"
