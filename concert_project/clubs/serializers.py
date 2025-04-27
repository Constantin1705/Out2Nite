from rest_framework import serializers
from .models import Activities

class ActivitiesSerializer(serializers.ModelSerializer):
    type_name = serializers.CharField(source='type.name', read_only=True)
    type_color = serializers.CharField(source='type.color.name', read_only=True)
    type_color_description = serializers.CharField(source='type.color.description', read_only=True)
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    event_type_name = serializers.CharField(source='event_type.name', read_only=True)
    price_category_name = serializers.CharField(source='price_category.name', read_only=True)

    class Meta:
        model = Activities
        fields = [
            'id',
            'name',
            'description',
            'latitude',
            'longitude',
            'live',
            'broadcasted_live',
            'event',
            'mood',
            'type_name',
            'type_color',
            'type_color_description',  
            'genre_name',
            'event_type_name',
            'price_category_name',
            'website',
            'address',
            'city',
            'phone',
            'email',
            'music',
        ]