from django.db import models

class PointColor(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class PinType(models.Model):
    name = models.CharField(max_length=100)
    color = models.ForeignKey(PointColor, on_delete=models.CASCADE, related_name='pin_types')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# 🎯 NEW: Dynamic Genre model
class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# 🎯 NEW: Dynamic EventType model
class EventType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# 🎯 NEW: Dynamic PriceCategory model
class PriceCategory(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# ✨ Updated Activities model
class Activities(models.Model):
    name = models.CharField(max_length=100,blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    type = models.ForeignKey(PinType, on_delete=models.CASCADE, related_name='activities',blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=255,blank=True, null=True)
    url_address = models.URLField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20,blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    image = models.ImageField(upload_to='activities/',blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    # 🎯 Linked to dynamic models
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.ForeignKey(EventType, on_delete=models.SET_NULL, null=True, blank=True)
    price_category = models.ForeignKey(PriceCategory, on_delete=models.SET_NULL, null=True, blank=True)
    live = models.BooleanField(default=False)
    broadcasted_live = models.TextField(blank=True, null=True)
    event = models.TextField(blank=True, null=True)
    mood = models.TextField(blank=True, null=True)
    music = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
