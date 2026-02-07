from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Note
from django.utils import timezone
from datetime import timedelta

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['last_login_custom', 'date_registered', 'is_active_now']

class UserDetailedSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    notes = NoteSerializer(many=True, read_only=True)
    notes_count = serializers.SerializerMethodField()
    inactive_duration = serializers.SerializerMethodField()
    is_currently_active = serializers.SerializerMethodField()
    registration_date = serializers.SerializerMethodField()
    last_login_display = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'is_active',
            'is_staff',
            'is_superuser',
            'last_login',
            'date_joined',
            'profile',
            'notes',
            'notes_count',
            'is_currently_active',
            'inactive_duration',
            'registration_date',
            'last_login_display'
        ]

    def get_profile(self, obj):
        try:
            profile = obj.profile
            return UserProfileSerializer(profile).data
        except:
            return None

    def get_notes_count(self, obj):
        return obj.notes.count()

    def get_is_currently_active(self, obj):
        try:
            profile = obj.profile
            if profile and profile.last_login_custom:
                is_active = timezone.now() - profile.last_login_custom < timedelta(minutes=15)
                return is_active
        except:
            pass
        return False

    def get_inactive_duration(self, obj):
        try:
            profile = obj.profile
            if profile and profile.last_login_custom:
                delta = timezone.now() - profile.last_login_custom
                days = delta.days
                hours = delta.seconds // 3600
                minutes = (delta.seconds % 3600) // 60

                if days > 0:
                    return f"{days}d {hours}h ago"
                elif hours > 0:
                    return f"{hours}h {minutes}m ago"
                else:
                    return f"{minutes}m ago"
        except:
            pass
        return "Never logged in"

    def get_registration_date(self, obj):
        try:
            profile = obj.profile
            if profile and profile.date_registered:
                return profile.date_registered.strftime("%Y-%m-%d %H:%M:%S")
        except:
            pass
        return obj.date_joined.strftime("%Y-%m-%d %H:%M:%S")

    def get_last_login_display(self, obj):
        try:
            profile = obj.profile
            if profile and profile.last_login_custom:
                return profile.last_login_custom.strftime("%Y-%m-%d %H:%M:%S")
        except:
            pass
        if obj.last_login:
            return obj.last_login.strftime("%Y-%m-%d %H:%M:%S")
        return "Never"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": False}
        }

    def create(self, validated_data):
        print(f"Creating user: {validated_data['username']}")
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Creates a profile
        UserProfile.objects.get_or_create(user=user)
        print(f"User created: {user.username}")
        return user


