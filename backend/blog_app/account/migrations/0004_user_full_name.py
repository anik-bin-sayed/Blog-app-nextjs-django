from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0003_user_is_banned"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="full_name",
            field=models.CharField(blank=True, default="", max_length=150),
        ),
    ]
