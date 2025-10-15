from rest_framework import serializers
from django.contrib.auth import get_user_model
from organizations.models import Organization, Membership

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True)
    preference = serializers.ListField(
        child=serializers.CharField(), write_only=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "company_name",
            "preference",
            "address",
            "phone_number",
        ]

    def validate_preference(self, value):
        """
        Ensure the preference list is not empty and contains valid choices.
        """
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one preference is required.")

        # optional: validate against defined PREFERENCES in Organization model
        valid_choices = [
            c[0]
            for c in Organization.PREFERENCES
        ]
        for v in value:
            if v not in valid_choices:
                raise serializers.ValidationError(f"Invalid preference: {v}")

        return value

    def create(self, validated_data):
        company_name = validated_data.pop("company_name")
        preferences = validated_data.pop("preference")

        # Create the user
        user = User.objects.create_user(**validated_data)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        # Create the organization
        org = Organization.objects.create(
            name=company_name,
            preference=preferences,
            owner=user
        )

        # Link the user to organization
        user.current_org = org
        user.company_name = org.name
        user.save()

        # Add default membership entry for owner
        Membership.objects.create(
            user=user,
            organization=org,
            role=Membership.Role.OWNER,
            can_manage_users=True,
            can_manage_inventory=True,
            can_manage_sales=True,
            can_manage_services=True,
            can_view_reports=True,
        )

        return user
