from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import *
from django.utils import timezone
from rest_framework.views import APIView


class CreateUserView(generics.CreateAPIView):
    """Allow anyone to register without authentication"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def perform_create(self, serializer):
        user = serializer.save()
        profile, created = UserProfile.objects.get_or_create(user=user)
        if created:
            print(f"UserProfile created for {user.username}")
        print(f"User registered: {user.username}")

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().prefetch_related('notes').select_related('profile')
    serializer_class = UserDetailedSerializer
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all().prefetch_related('notes').select_related('profile')
    serializer_class = UserDetailedSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailedSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        note = serializer.save(author=self.request.user)
        print(f"Note created: {note.title} by {self.request.user.username}")

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        print(f"Fetching current user: {request.user.username}")
        serializer = UserDetailedSerializer(request.user)
        return Response(serializer.data)