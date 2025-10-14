from rest_framework import serializers
from django.contrib.auth import get_user_model
from organizations.models import Organization, Membership

User = get_user_model()


# ------------------------------
# 1️⃣  USER SIGNUP SERIALIZER
# ------------------------------
class UserSignupSerializer(serializers.ModelSerializer):
    """
    Handles new user registration and automatic organization creation.
    Supports multiple 'preference' selections (ArrayField).
    """

    # Allow multiple industries to be selected
    preference = serializers.ListField(
        child=serializers.ChoiceField(choices=Organization.PREFERENCES),
        required=False
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "company_name",
            "address",
            "phone_number",
            "preference",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_preference(self, value):
        """Normalize preference: convert string to list if necessary."""
        if isinstance(value, str):
            return [value]
        if not isinstance(value, list):
            raise serializers.ValidationError("Preference must be a list or string.")
        return value

    def create(self, validated_data):
        preferences = validated_data.pop("preference", [])
        password = validated_data.pop("password")

        # Create user (first signup becomes org owner)
        user = User.objects.create_user(password=password, **validated_data)

        # Create organization and link to user
        org = Organization.objects.create(
            name=user.company_name or f"{user.username}'s Organization",
            owner=user,
            preference=preferences or ["other"],
        )

        user.current_org = org
        user.is_superuser = True  # First signup becomes superuser
        user.is_staff = True
        user.save()

        # Also create a Membership record
        Membership.objects.create(
            user=user,
            organization=org,
            role=Membership.Role.OWNER,
            can_manage_sales=True,
            can_manage_inventory=True,
            can_manage_services=True,
            can_view_reports=True,
            can_manage_users=True,
            can_create_customers=True,
        )

        return user


# ------------------------------
# 2️⃣  STAFF CREATION SERIALIZER
# ------------------------------
class StaffCreateSerializer(serializers.ModelSerializer):
    """
    Allows organization owners to add new staff with fine-grained permissions.
    """

    # INPUT fields for user creation
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    can_edit_preference = serializers.BooleanField(default=False)

    # OUTPUT fields (after creation)
    id = serializers.IntegerField(read_only=True)
    role = serializers.CharField(read_only=True)
    organization = serializers.CharField(source="organization.name", read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Membership
        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
            "can_edit_preference",
            "can_manage_sales",
            "can_manage_inventory",
            "can_manage_services",
            "can_view_reports",
            "can_manage_users",
            "can_create_customers",
            "organization",
            "user_name",
            "user_email",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        org = Organization.objects.get(owner=request.user)

        username = validated_data.pop("username")
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        # Prevent duplicates
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "This username already exists."})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email already exists."})

        # Create the staff user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            company_name=org.name,
            current_org=org,
        )

        # Create membership record
        membership = Membership.objects.create(
            user=user,
            organization=org,
            role=validated_data.get("role", Membership.Role.STAFF),
            can_edit_preference=validated_data.get("can_edit_preference", False),
            can_manage_sales=validated_data.get("can_manage_sales", False),
            can_manage_inventory=validated_data.get("can_manage_inventory", False),
            can_manage_services=validated_data.get("can_manage_services", False),
            can_view_reports=validated_data.get("can_view_reports", False),
            can_manage_users=validated_data.get("can_manage_users", False),
            can_create_customers=validated_data.get("can_create_customers", False),
        )

        return membership
