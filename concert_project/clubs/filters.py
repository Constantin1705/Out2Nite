# filters.py
import django_filters
from .models import Activities

class ActivitiesFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')
    genre = django_filters.NumberFilter(field_name='genre_id')
    event_type = django_filters.NumberFilter(field_name='event_type_id')

    class Meta:
        model = Activities
        fields = ['city', 'genre', 'event_type']
