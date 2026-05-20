from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=150, required=True, trim_whitespace=True)

    class Meta:
        model = User
        fields = ["email", "username", "full_name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_full_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Full name must be at least 2 characters."
            )
        return value.strip()

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True}}


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "role",
            "is_active",
            "is_banned",
        ]
