from django.urls import path
from .views import (
    RegisterView,
    CheckEmailView,
    CheckUsernameView,
    GenreListView,
    MoodListView,
    UserProfileDetailView,
    CookieLoginView,
    LogoutView,
    UserMeView,
    UserProfileMeView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CookieLoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', UserMeView.as_view(), name='user-me'),
    path('auth/profile-me/', UserProfileMeView.as_view(), name='profile-me'),
    path('auth/check-email/', CheckEmailView.as_view(), name='check-email'),
    path('auth/check-username/', CheckUsernameView.as_view(), name='check-username'),
    path('genres/', GenreListView.as_view(), name='genres'),
    path('moods/', MoodListView.as_view(), name='moods'),
    path('profile/', UserProfileDetailView.as_view(), name='profile'),
]
