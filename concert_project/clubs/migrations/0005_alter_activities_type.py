# Generated by Django 5.2 on 2025-04-27 16:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0004_alter_activities_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activities',
            name='type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='clubs.pintype'),
        ),
    ]
