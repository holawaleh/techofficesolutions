from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()


# ----------------------------
# 🔹 LOGIN SERIALIZER
# ----------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Handles login with username OR email, returns tokens + user info.
    """

    def validate(self, attrs):
        login_field = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=login_field, password=password)
        if user is None:
            # Try login via email
            try:
                user_obj = User.objects.get(email__iexact=login_field)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError("Invalid login credentials.")

        refresh = self.get_token(user)

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
                "purpose_of_use": getattr(user, "purpose_of_use", []),
                "is_superuser": user.is_superuser,
                "is_staff": user.is_staff,
            },
        }


# ----------------------------
# 🔹 SIGNUP SERIALIZER
# ----------------------------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    purpose_of_use = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        help_text="List of selected business areas (e.g. ['commerce','health'])",
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "company_name",
            "address",
            "phone_number",
            "purpose_of_use",
        )

    def create(self, validated_data):
        purpose_of_use = validated_data.pop("purpose_of_use", [])

        validated_data["is_superuser"] = True
        validated_data["is_staff"] = True

        user = User.objects.create_user(**validated_data)

        # ✅ Ensure the JSON field is committed immediately
        user.purpose_of_use = purpose_of_use
        user.save(update_fields=["purpose_of_use"])

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
                "purpose_of_use": user.purpose_of_use,
                "is_superuser": user.is_superuser,
                "is_staff": user.is_staff,
            },
        }

def to_representation(self, instance):
    # If instance is already our token dict, just return it
    if isinstance(instance, dict):
        return instance
    # Otherwise, fall back to normal DRF behavior
    return super().to_representation(instance)


# ----------------------------
# 🔹 STAFF CREATION SERIALIZER
# ----------------------------
class StaffCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "company_name", "address", "phone_number")

    def create(self, validated_data):
        validated_data["is_staff"] = True
        validated_data["is_superuser"] = False
        user = User.objects.create_user(**validated_data)
        return user
