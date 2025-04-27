# concerts/serializers.py
from rest_framework import serializers
from .models import ConcertEvent

class ConcertSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConcertEvent
        fields = '__all__'
