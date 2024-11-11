# Generated by Django 5.0.7 on 2024-10-04 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_lecture_created_dt_lecture_updated_dt'),
    ]

    operations = [
        migrations.AddField(
            model_name='sublecturedocument',
            name='created_dt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='sublecturedocument',
            name='updated_dt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='sublecturequiz',
            name='created_dt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='sublecturequiz',
            name='updated_dt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='sublecturevideo',
            name='created_dt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='sublecturevideo',
            name='updated_dt',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
