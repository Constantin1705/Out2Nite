# Generated by Django 5.2 on 2025-04-27 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0003_alter_activities_image_alter_activities_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activities',
            name='address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
