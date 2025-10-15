from django.db import models
from django.conf import settings
from organizations.models import Organization


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("fashion", "Fashion & Apparel"),
        ("health", "Health / Pharmacy"),
        ("agriculture", "Agriculture"),
        ("food", "Food & Beverage"),
        ("services", "Technical / Misc Services"),
        ("other", "Other"),
    ]

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="inventory_products"
    )

    name = models.CharField(max_length=200)
    model = models.CharField(max_length=150, blank=True)
    serial_number = models.CharField(max_length=150, blank=True, unique=True)
    footnote = models.CharField(max_length=300, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="other")

    quantity = models.PositiveIntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    # supplier details entered inline
    supplier_name = models.CharField(max_length=200, blank=True)
    supplier_contact = models.CharField(max_length=150, blank=True)
    supplier_phone = models.CharField(max_length=20, blank=True)
    supplier_email = models.EmailField(blank=True)
    supplier_address = models.TextField(blank=True)
    date_supplied = models.DateField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_inventory_products"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_value(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.name} ({self.organization.name})"
