# serializers.py
from rest_framework import serializers
from .models import Activities, Genre, EventType, PriceCategory, PinType, PointColor

class PointColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointColor
        fields = ['id', 'name']

class PinTypeSerializer(serializers.ModelSerializer):
    color = PointColorSerializer()

    class Meta:
        model = PinType
        fields = ['id', 'name', 'color']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'name']

class PriceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceCategory
        fields = ['id', 'name']

class ActivitiesSerializer(serializers.ModelSerializer):
    type = PinTypeSerializer()
    genre = GenreSerializer()
    event_type = EventTypeSerializer()
    price_category = PriceCategorySerializer()

    class Meta:
        model = Activities
        fields = '__all__'
