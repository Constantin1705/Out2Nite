from django.urls import path
from .views import CookieLoginView, LogoutView, RegisterView, UserMeView, UserProfileMeView

urlpatterns = [
    path('auth/login/', CookieLoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', UserMeView.as_view(), name='me'),
    path('auth/profile/', UserProfileMeView.as_view(), name='profile'),
    path('auth/register/',RegisterView.as_view(),name="register")
]
