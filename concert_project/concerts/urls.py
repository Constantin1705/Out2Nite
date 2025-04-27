# concerts/urls.py
from django.urls import path
from .views import ConcertListView

urlpatterns = [
    path('concerts/', ConcertListView.as_view(), name='concerts-list')
]
