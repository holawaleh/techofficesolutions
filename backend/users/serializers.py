from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "company_name", "address", "phone_number")

    def create(self, validated_data):
        # Public signups = super accounts
        validated_data["is_superuser"] = True
        validated_data["is_staff"] = True

        user = User.objects.create_user(**validated_data)

        # ✅ Auto-generate tokens
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "company_name": user.company_name,
                "address": user.address,
                "phone_number": user.phone_number,
                "is_superuser": user.is_superuser,
                "is_staff": user.is_staff,
            },
        }

    def to_representation(self, instance):
        """
        When DRF calls `serializer.data`, ensure we return the token payload
        (not the user object directly, since `create` already returns a dict).
        """
        return instance
