from django.db import migrations

def backfill_companies(apps, schema_editor):
    Company = apps.get_model("users", "Company")
    User = apps.get_model("users", "CustomUser")

    # Get all distinct company_name values that exist
    names = (
        User.objects.exclude(company_name__isnull=True)
        .exclude(company_name__exact="")
        .values_list("company_name", flat=True)
        .distinct()
    )

    # Create a Company object for each unique company_name
    name_to_company = {}
    for name in names:
        company, _ = Company.objects.get_or_create(name=name)
        name_to_company[name] = company

    # Link each user to the new Company
    for user in User.objects.all():
        if user.company_id is None and user.company_name:
            company = name_to_company.get(user.company_name)
            if company:
                user.company_id = company.id
                user.save(update_fields=["company"])

def reverse_func(apps, schema_editor):
    # No-op: we won’t delete companies if rolled back
    pass

class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_company_alter_customuser_managers_customuser_company"),
    ]

    operations = [
        migrations.RunPython(backfill_companies, reverse_func),
    ]
