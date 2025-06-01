import os
import uuid
from django.contrib.auth.models import User
import requests
from rest_framework import serializers
from .models import Genre, Mood, UserProfile
from urllib.request import urlopen, urlretrieve
from django.core.files.base import ContentFile
from datetime import date
from django.db import transaction, IntegrityError
from urllib.request import urlopen
from django.db import IntegrityError

# Genre Serializer
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


# Mood Serializer
class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['id', 'name']


# Full Profile Serializer (for retrieving profile info)
class UserProfileSerializer(serializers.ModelSerializer):
    favorite_genres = GenreSerializer(many=True, read_only=True)
    mood_for_tonight = MoodSerializer(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    birth_date = serializers.DateField()
    uuid = serializers.UUIDField(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'nickname',
            'profile_picture_url',
            'favorite_genres',
            'mood_for_tonight',
            'birth_date',
            'uuid',
        ]

    def get_profile_picture_url(self, obj):
        return obj.get_profile_picture_url()


# Extended Register Serializer



class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    nickname = serializers.CharField(allow_blank=True, required=False)
    birth_date = serializers.DateField()
    mood_for_tonight = serializers.IntegerField(required=False)
    favorite_genres = serializers.ListField(
        child=serializers.IntegerField(), required=False
    )
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    profile_picture_url = serializers.URLField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_birth_date(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old.")
        return value

    def validate_password(self, value):
        import re
        if len(value) < 8 or not re.search(r"[A-Z]", value) or not re.search(r"\d", value) or not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("Password too weak.")
        return value

    def validate_mood_for_tonight(self, value):
        if not Mood.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Invalid mood ID.")
        return value

    def validate_favorite_genres(self, value):
        genres = Genre.objects.filter(pk__in=value)
        if genres.count() != len(value):
            raise serializers.ValidationError("One or more genre IDs are invalid.")
        return value

    def create(self, validated_data):
        # extragere câmpuri speciale
        profile_picture = validated_data.pop("profile_picture", None)
        profile_picture_url = validated_data.pop("profile_picture_url", None)
        favorite_genres = validated_data.pop("favorite_genres", [])
        mood_id = validated_data.pop("mood_for_tonight", None)

        # creare user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        # profilul este deja creat de semnal → doar îl completăm
        profile = user.profile
        profile.nickname = validated_data.get("nickname", "")
        profile.birth_date = validated_data["birth_date"]
        if mood_id:
            profile.mood_for_tonight_id = mood_id

        if profile_picture:
            profile.profile_picture = profile_picture
        elif profile_picture_url:
            try:
                response = requests.get(profile_picture_url)
                response.raise_for_status()
                ext = os.path.splitext(profile_picture_url)[-1] or ".jpg"
                filename = f"{uuid.uuid4()}{ext}"
                profile.profile_picture.save(filename, ContentFile(response.content))
            except Exception as e:
                print("⚠️ Failed to download avatar:", e)

        profile.favorite_genres.set(favorite_genres)
        profile.save()
        return user
    
# User Serializer (basic)
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']