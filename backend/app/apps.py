from django.apps import AppConfig
import os
from django.contrib.auth import get_user_model


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        import app.signals