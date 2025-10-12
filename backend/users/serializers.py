from rest_framework import serializers
from django.contrib.auth import get_user_model
from organizations.models import Organization

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True)
    preference = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'company_name', 'preference', 'address', 'phone_number']

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        preference = validated_data.pop('preference')

        # create user
        user = User.objects.create_user(**validated_data)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        # create organization
        org = Organization.objects.create(
            name=company_name,
            preference=preference,
            owner=user
        )

        # link user to that organization
        user.current_org = org
        user.company_name = org.name
        user.save()

        return user
