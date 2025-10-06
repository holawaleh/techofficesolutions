from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model

# Get the active user model
User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "company_name", "address", "phone_number")

    def create(self, validated_data):
        # All signups via the public signup endpoint should be super accounts
        validated_data["is_superuser"] = True
        validated_data["is_staff"] = True
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_field = attrs.get("username")  # may be username OR email
        password = attrs.get("password")

        user = None

        # Try username login
        user = authenticate(username=login_field, password=password)

        # Try email login
        if user is None:
            try:
                user_obj = User.objects.get(email__iexact=login_field)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError("Invalid login credentials.")

        # Build tokens manually
        refresh = self.get_token(user)

        data = {
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
        return data

class StaffCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "company_name", "address", "phone_number")

    def create(self, validated_data):
        # Staff accounts are NOT superusers
        validated_data["is_staff"] = True
        validated_data["is_superuser"] = False
        return User.objects.create_user(**validated_data)
