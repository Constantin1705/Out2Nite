from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin
from .models import (
    PointColor,
    PinType,
    Activities,
    Genre,
    EventType,
    PriceCategory
)
from .utils import get_google_maps_data

# ✅ Resources for import-export

class PointColorResource(resources.ModelResource):
    class Meta:
        model = PointColor

class ActivitiesResource(resources.ModelResource):
    type = fields.Field(
        attribute='type',
        column_name='Type',
        widget=ForeignKeyWidget(PinType, 'name')
    )
    genre = fields.Field(
        attribute='genre',
        column_name='Genre',
        widget=ForeignKeyWidget(Genre, 'name')
    )
    event_type = fields.Field(
        attribute='event_type',
        column_name='Event Type',
        widget=ForeignKeyWidget(EventType, 'name')
    )
    price_category = fields.Field(
        attribute='price_category',
        column_name='Price Category',
        widget=ForeignKeyWidget(PriceCategory, 'name')
    )

    class Meta:
        model = Activities
        fields = (
            'id',
            'name',
            'description',
            'type',
            'genre',
            'event_type',
            'price_category',
            'website',
            'address',
            'url_address',
            'city',
            'phone',
            'email',
            'latitude',
            'longitude',
            'live',
            'broadcasted_live',
            'event',
            'mood',
            'music',
            'is_active',
            'created_at',
            'updated_at',
        )
        export_order = fields

    def before_import_row(self, row, row_number=None, **kwargs):
        instance = kwargs.get('instance')

        if instance and instance.url_address and (not instance.latitude or not instance.longitude):
            data = get_google_maps_data(instance.url_address)
            if data:
                if not instance.name and data.get('name'):
                    instance.name = data['name']
                if not instance.address and data.get('address'):
                    instance.address = data['address']
                if not instance.city and data.get('city'):
                    instance.city = data['city']
                if not instance.latitude and data.get('latitude'):
                    instance.latitude = data['latitude']
                if not instance.longitude and data.get('longitude'):
                    instance.longitude = data['longitude']

# ✅ PointColor Admin (Import-Export enabled)
@admin.register(PointColor)
class PointColorAdmin(ImportExportModelAdmin):
    resource_class = PointColorResource
    list_display = ('name', 'description')
    search_fields = ('name',)

# ✅ PinType Admin
@admin.register(PinType)
class PinTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'is_active', 'created_at')
    list_filter = ('is_active', 'color')
    search_fields = ('name',)
    autocomplete_fields = ('color',)

# ✅ Activities Admin (Import-Export enabled, autocomplete PinType)
@admin.register(Activities)
class ActivitiesAdmin(ImportExportModelAdmin):
    resource_class = ActivitiesResource
    autocomplete_fields = ('type', 'genre', 'event_type', 'price_category')
    list_display = ('name', 'type', 'genre', 'event_type', 'price_category', 'address', 'city', 'phone', 'live', 'is_active', 'created_at')
    list_filter = ('is_active', 'live', 'type', 'genre', 'event_type', 'price_category')
    search_fields = ('name', 'address', 'city', 'phone', 'email')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'type', 'genre', 'event_type', 'price_category', 'image', 'url_address', 'latitude', 'longitude')
        }),
        ('Contact Info', {
            'fields': ('website', 'address', 'city', 'phone', 'email')
        }),
        ('Event Details', {
            'fields': ('live', 'broadcasted_live', 'event', 'mood', 'music')
        }),
        ('Status & Timestamps', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )

    # Auto-fill from Google Maps url_address
    def save_model(self, request, obj, form, change):
        if obj.url_address:
            data = get_google_maps_data(obj.url_address)
            if data:
                if not obj.name and data.get('name'):
                    obj.name = data['name']
                if not obj.address and data.get('address'):
                    obj.address = data['address']
                if not obj.city and data.get('city'):
                    obj.city = data['city']
                if not obj.latitude and data.get('latitude'):
                    obj.latitude = data['latitude']
                if not obj.longitude and data.get('longitude'):
                    obj.longitude = data['longitude']
        super().save_model(request, obj, form, change)

# ✅ Genre Admin
@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# ✅ EventType Admin
@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# ✅ PriceCategory Admin
@admin.register(PriceCategory)
class PriceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
