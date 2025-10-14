from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Organization(models.Model):
    """
    Represents a single company or business account in the SaaS platform.
    Each organization belongs to one owner (a superuser created during signup).
    """

    PREFERENCES = [
        ("hospitality", "Hospitality"),
        ("commerce", "Commerce"),
        ("pharmacy", "Pharmacy / Health"),
        ("agriculture", "Agriculture"),
        ("tourism", "Tourism"),
        ("technical_services", "Technical Services"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=150)
    preference = ArrayField(
    models.CharField(max_length=50,         choices=PREFERENCES),
    default=list,
    blank=True
)
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_organization"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.get_preference_display()})"


class Membership(models.Model):
    """
    Connects users to an organization, defining their role and permissions.
    """

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
        Organization,
        on_delete=models.CASCADE,
        related_name="memberships"
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STAFF
    )
    can_edit_preference = models.BooleanField(default=False)

    # ---- Fine-grained permissions ----
    can_manage_sales = models.BooleanField(default=False)
    can_manage_inventory = models.BooleanField(default=False)
    can_manage_services = models.BooleanField(default=False)
    can_view_reports = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)
    can_create_customers = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "organization")
        ordering = ["organization", "role"]

    def __str__(self):
        return f"{self.user.username} – {self.organization.name} ({self.role})"
