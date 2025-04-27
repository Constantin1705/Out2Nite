from rest_framework import generics
from .models import Activities
from .serializers import ActivitiesSerializer
from rest_framework.permissions import AllowAny

class ActivitiesListView(generics.ListAPIView):
    queryset = Activities.objects.filter(is_active=True)
    serializer_class = ActivitiesSerializer
    permission_classes = [AllowAny]
