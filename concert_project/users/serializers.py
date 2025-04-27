from django.contrib.auth.models import User
from .models import Genre,Mood,UserProfile
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "password", "email")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['id', 'name']

class UserProfileSerializer(serializers.ModelSerializer):
    favorite_genres = GenreSerializer(many=True, read_only=True)
    mood_for_tonight = MoodSerializer(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'nickname', 'profile_picture_url', 'favorite_genres', 'mood_for_tonight']

    def get_profile_picture_url(self, obj):
        return obj.get_profile_picture_url()