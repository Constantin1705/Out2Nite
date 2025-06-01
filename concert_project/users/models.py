from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils import timezone


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Mood(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


def get_expiry_date():
    return timezone.now() + timedelta(days=3*365)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    nickname = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    favorite_genres = models.ManyToManyField(Genre, blank=True)
    mood_for_tonight = models.ForeignKey(Mood, on_delete=models.SET_NULL, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    activation_expires_at = models.DateTimeField(default=get_expiry_date)

    def __str__(self):
        return self.nickname if self.nickname else self.user.username

    def get_profile_picture_url(self):
        if self.profile_picture:
            return self.profile_picture.url
        return 'https://cdn.quasar.dev/img/avatar1.jpg'  # use a static default image

    def deactivate_if_expired(self):
        if self.is_active and self.activation_expires_at and timezone.now() > self.activation_expires_at:
            self.is_active = False
            self.save()

    