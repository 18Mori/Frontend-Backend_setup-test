from django.apps import AppConfig
import os
from django.contrib.auth import get_user_model


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        import app.signals
        try:
            User = get_user_model()
            username = os.environ.get("ADMIN_USERNAME")
            email = os.environ.get("ADMIN_EMAIL")
            password = os.environ.get("ADMIN_PASSWORD")
            if username and password and not User.objects.filter(username=username).exists():
                User.objects.create_superuser(username=username, email=email, password=password)
                print(f"Created superuser {username}")
        except Exception:
            pass