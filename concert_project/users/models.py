from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Mood(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    favorite_genres = models.ManyToManyField(Genre, blank=True)
    mood_for_tonight = models.ForeignKey(Mood, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nickname if self.nickname else self.user.username


    def get_profile_picture_url(self):
        if self.profile_picture:
            return self.profile_picture.url
        return 'https://cdn.quasar.dev/img/avatar1.jpg'  # use a static default image
