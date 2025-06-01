from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Activities, Genre, EventType, PriceCategory
from .serializers import ActivitiesSerializer, GenreSerializer, EventTypeSerializer, PriceCategorySerializer
from .filters import ActivitiesFilter

# 🎯 Pagination class
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

# 🎯 Main Activities list with filter & pagination
class ActivitiesListAPIView(generics.ListAPIView):
    queryset = Activities.objects.filter(is_active=True, live=True)
    serializer_class = ActivitiesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ActivitiesFilter
    pagination_class = StandardResultsSetPagination

# ✅ PATCH endpoint to toggle is_active
@api_view(['PATCH'])
def toggle_activity_status(request, pk):
    activity = get_object_or_404(Activities, pk=pk)
    activity.is_active = not activity.is_active
    activity.save()
    return Response({'status': 'updated', 'is_active': activity.is_active}, status=status.HTTP_200_OK)

# ✅ PATCH endpoint to toggle live
@api_view(['PATCH'])
def toggle_activity_live(request, pk):
    activity = get_object_or_404(Activities, pk=pk)
    activity.live = not activity.live
    activity.save()
    return Response({'status': 'updated', 'live': activity.live}, status=status.HTTP_200_OK)

# 🎯 Support API endpoints for dropdowns
class GenreListAPIView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class EventTypeListAPIView(generics.ListAPIView):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer

class PriceCategoryListAPIView(generics.ListAPIView):
    queryset = PriceCategory.objects.all()
    serializer_class = PriceCategorySerializer
