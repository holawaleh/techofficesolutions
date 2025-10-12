from rest_framework import serializers
from users.models import User
from .models import Membership, Organization

class StaffCreateSerializer(serializers.ModelSerializer):
    # Extra fields for creating the user account
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    can_edit_preference = serializers.BooleanField(default=False)

    class Meta:
        model = Membership
        fields = ["username", "email", "password", "role", "can_edit_preference"]

    def create(self, validated_data):
        request = self.context["request"]
        org = Organization.objects.get(owner=request.user)

        # create the staff user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            company_name=org.name,
            current_org=org
        )

        # create membership record
        membership = Membership.objects.create(
            user=user,
            organization=org,
            role=validated_data.get("role", Membership.Role.STAFF),
            can_edit_preference=validated_data.get("can_edit_preference", False)
        )

        return membership
