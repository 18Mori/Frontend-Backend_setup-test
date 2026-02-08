# from django.core.management.base import BaseCommand
# from django.contrib.auth.models import User
# from app.models import Note, UserProfile
# from django.utils import timezone
# from datetime import timedelta

#     # python manage.py populate_test_data
# class Command(BaseCommand):
#     help = 'Populate test data with users and notes'

#     def handle(self, *args, **options):
#         # Create test users
#         test_users = [
#             {'username': 'testuser1', 'password': 'testpass123', 'email': 'test1@example.com'},
#             {'username': 'testuser2', 'password': 'testpass123', 'email': 'test2@example.com'},
#             {'username': 'testuser3', 'password': 'testpass123', 'email': 'test3@example.com'},
#         ]

#         for user_data in test_users:
#             user, created = User.objects.get_or_create(
#                 username=user_data['username'],
#                 defaults={
#                     'email': user_data['email'],
#                 }
#             )
#             if created:
#                 user.set_password(user_data['password'])
#                 user.save()
#                 self.stdout.write(f"✅ Created user: {user.username}")
            
#             # Create or get profile
#             profile, _ = UserProfile.objects.get_or_create(user=user)
            
#             # Set last login to simulate activity
#             if user.username == 'testuser1':
#                 # Active user (logged in 2 minutes ago)
#                 profile.last_login_custom = timezone.now() - timedelta(minutes=2)
#                 profile.is_active_now = True
#             elif user.username == 'testuser2':
#                 # Inactive user (logged in 2 hours ago)
#                 profile.last_login_custom = timezone.now() - timedelta(hours=2)
#                 profile.is_active_now = False
#             else:
#                 # Inactive user (logged in 1 day ago)
#                 profile.last_login_custom = timezone.now() - timedelta(days=1)
#                 profile.is_active_now = False
            
#             profile.save()
#             self.stdout.write(f"✅ Updated profile for: {user.username}")

#         # Create test notes
#         notes_data = [
#             {'user': 'testuser1', 'title': 'My First Note', 'content': 'This is my first note about the project'},
#             {'user': 'testuser1', 'title': 'Meeting Notes', 'content': 'Discussed project timeline and milestones'},
#             {'user': 'testuser2', 'title': 'TODO List', 'content': 'Complete API integration\nFix bugs\nWrite tests'},
#             {'user': 'testuser3', 'title': 'Documentation', 'content': 'Update readme file with new features'},
#         ]

#         for note_data in notes_data:
#             user = User.objects.get(username=note_data['user'])
#             note, created = Note.objects.get_or_create(
#                 author=user,
#                 title=note_data['title'],
#                 defaults={'content': note_data['content']}
#             )
#             if created:
#                 self.stdout.write(f"✅ Created note: {note.title} for {user.username}")

#         self.stdout.write(self.style.SUCCESS("✅ Test data populated successfully!"))