from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        org = getattr(user, "current_org", None)
        return Product.objects.filter(organization=org)

    def perform_create(self, serializer):
        user = self.request.user
        org = getattr(user, "current_org", None)
        serializer.save(created_by=user, organization=org)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        org = getattr(user, "current_org", None)
        return Product.objects.filter(organization=org)

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser and "unit_price" in request.data:
            return Response(
                {"detail": "Only superusers can update product prices."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
