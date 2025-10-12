from django.db import models
from django.conf import settings

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
