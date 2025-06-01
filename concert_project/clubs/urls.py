from django.urls import path
from .views import (
    ActivitiesListAPIView,
    toggle_activity_status,
    toggle_activity_live,
    GenreListAPIView,
    EventTypeListAPIView,
    PriceCategoryListAPIView,
)

urlpatterns = [
    path('activities/', ActivitiesListAPIView.as_view(), name='activities-list'),
    path('activities/<int:pk>/toggle-status/', toggle_activity_status, name='toggle-activity-status'),
    path('activities/<int:pk>/toggle-live/', toggle_activity_live, name='toggle-activity-live'),
    path('genres/', GenreListAPIView.as_view(), name='genre-list'),
    path('event-types/', EventTypeListAPIView.as_view(), name='event-type-list'),
    path('price-categories/', PriceCategoryListAPIView.as_view(), name='price-category-list'),
]
