# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("username", "email", "company_name", "is_staff", "is_active")
    search_fields = ("username", "email", "company_name", "phone_number")

    fieldsets = UserAdmin.fieldsets + (
        ("Profile", {"fields": ("company_name", "address", "phone_number")}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2",
                       "company_name", "address", "phone_number"),
        }),
    )
