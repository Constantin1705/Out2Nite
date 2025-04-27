from django.urls import path
from .views import RegisterView, UserMeView, UserProfileMeView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('auth/me/', UserMeView.as_view(), name='user_me'),
    path('profile/me/', UserProfileMeView.as_view(), name='profile_me'),
]

