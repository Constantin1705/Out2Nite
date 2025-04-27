from django.urls import path
from .views import ActivitiesListView

urlpatterns = [
    path('activities/', ActivitiesListView.as_view(), name='activities-list'),
]
