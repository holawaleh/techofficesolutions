from django.conf import settings
from django.db import models

class Organization(models.Model):
    PREFERENCES = [
        ('hospitality', 'Hospitality'),
        ('commerce', 'Commerce'),
        ('pharmacy', 'Pharmacy'),
        ('agriculture', 'Agriculture'),
        ('tourism', 'Tourism'),
        ('technical_services', 'Technical Services'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=150)
    preference = models.CharField(max_length=50, choices=PREFERENCES, default='other')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_orgs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Membership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        ADMIN = "admin", "Admin"
        STAFF = "staff", "Staff"
        VIEWER = "viewer", "Viewer"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="membership"
    )
    organization = models.ForeignKey(
        "Organization",
        on_delete=models.CASCADE,
        related_name="memberships"
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STAFF
    )
    can_edit_preference = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} – {self.organization.name} ({self.role})"
