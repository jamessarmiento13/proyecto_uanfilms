#!/bin/bash
python manage.py collectstatic --noinput
gunicorn uanfilms.wsgi --bind=0.0.0.0 --timeout 600
