import uuid
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Genre, Mood, UserProfile
from urllib.request import urlopen
from django.core.files.base import ContentFile
import uuid
from django.db import transaction, IntegrityError
import traceback
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


# User Serializer (basic)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


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
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Genre, Mood, UserProfile
from urllib.request import urlopen
from django.core.files.base import ContentFile
import uuid
from django.db import IntegrityError


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    nickname = serializers.CharField(required=False, allow_blank=True)
    birth_date = serializers.DateField(required=True)
    mood_for_tonight = serializers.CharField(required=False, allow_blank=True)
    favorite_genres = serializers.ListField(child=serializers.CharField(), required=False)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    profile_picture_url = serializers.URLField(required=False, allow_blank=True)

    def validate_birth_date(self, value):
        from datetime import date
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old to register.")
        return value

    def create(self, validated_data):
        nickname = validated_data.pop("nickname", "")
        birth_date = validated_data.pop("birth_date")
        profile_picture = validated_data.pop("profile_picture", None)
        profile_picture_url = validated_data.pop("profile_picture_url", "")
        mood_id = validated_data.pop("mood_for_tonight", None)
        raw_genre_ids = validated_data.pop("favorite_genres", [])

        username = validated_data.get("username")
        email = validated_data.get("email")
        password = validated_data.get("password")

        genre_ids = []
        for gid in raw_genre_ids:
            try:
                genre_ids.append(int(gid))
            except ValueError:
                pass

        mood_instance = None
        if mood_id:
            try:
                mood_instance = Mood.objects.get(pk=int(mood_id))
            except (ValueError, Mood.DoesNotExist):
                pass

        try:
            with transaction.atomic():
                if User.objects.filter(username=username).exists():
                    raise serializers.ValidationError({"username": "Username already exists."})
                if User.objects.filter(email=email).exists():
                    raise serializers.ValidationError({"email": "Email already exists."})

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )

                try:
                    profile = UserProfile.objects.create(
                        user=user,
                        nickname=nickname,
                        birth_date=birth_date,
                        mood_for_tonight=mood_instance
                    )

                    if genre_ids:
                        profile.favorite_genres.set(Genre.objects.filter(id__in=genre_ids))

                    if profile_picture:
                        profile.profile_picture = profile_picture
                    elif profile_picture_url:
                        try:
                            image_data = urlopen(profile_picture_url).read()
                            filename = f'{uuid.uuid4()}.jpg'
                            profile.profile_picture.save(filename, ContentFile(image_data))
                        except Exception as e:
                            print("Failed to download avatar image:", e)

                    profile.save()
                    return user

                except Exception as e:
                    print("Failed to create UserProfile:", e)
                    user.delete()  # Cleanup if profile fails
                    raise serializers.ValidationError({"detail": "Profile creation failed. User rolled back."})

        except IntegrityError as e:
            print("IntegrityError:", e)
            import traceback
            traceback.print_exc()
            raise serializers.ValidationError({"detail": "IntegrityError: " + str(e)})
