from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    total_value = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "model", "serial_number", "footnote", "category",
            "quantity", "unit_price", "total_value",
            "supplier_name", "supplier_contact", "supplier_phone", "supplier_email", "supplier_address",
            "date_supplied", "created_by", "organization", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "organization", "total_value", "created_at", "updated_at"]

    def validate(self, data):
        request = self.context.get("request")
        if request and not request.user.is_superuser and "unit_price" in data:
            raise serializers.ValidationError(
                {"unit_price": "Only the superuser can set or change prices."}
            )
        return data
