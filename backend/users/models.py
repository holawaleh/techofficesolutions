# users/models.py
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

phone_validator = RegexValidator(
    regex=r"^\+?\d{7,15}$",
    message="Enter a valid phone number with 7–15 digits. Example: +2348012345678",
)

class Company(models.Model):
    name = models.CharField(max_length=150, unique=True)
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=16, blank=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    # Old string field (kept for backfill; we’ll drop later)
    company_name = models.CharField(max_length=150, blank=True)

    # New canonical link
    company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.CASCADE)

    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=16, blank=True, validators=[phone_validator])

    # REQUIRED_FIELDS etc. can remain as you had them
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return f"{self.username} ({self.email})"
