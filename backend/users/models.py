from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    company_name = models.CharField(max_length=150, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)

    # extra field to track the user's main organization later
    current_org = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.SET_NULL,
        null=True, blank=True, related_name='members'
    )

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
