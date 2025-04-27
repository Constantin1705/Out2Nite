from django.contrib import admin
from .models import Genre, Mood, UserProfile

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nickname', 'mood_for_tonight')
    search_fields = ('user__username', 'nickname')
    filter_horizontal = ('favorite_genres',)  # multi-select widget
