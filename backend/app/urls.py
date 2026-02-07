from django.urls import path
from .views import *

urlpatterns = [
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/me/", CurrentUserView.as_view(), name="user-me"),
    
    path("api/users/", UserListView.as_view(), name="user-list"),
    path("api/users/<int:id>/", UserDetailView.as_view(), name="user-detail"),
    path("api/users/delete/<int:id>/", UserDeleteView.as_view(), name="user-delete"),
    
    path("api/notes/", NoteListCreate.as_view(), name="note-list"),
    path("api/notes/delete/<int:pk>/", NoteDelete.as_view(), name="delete-note"),
]
