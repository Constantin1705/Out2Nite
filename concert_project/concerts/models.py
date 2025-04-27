from django.db import models

class ConcertEvent(models.Model):
    name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    date = models.DateTimeField()
