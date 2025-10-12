from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import StaffCreateSerializer

class AddStaffView(generics.CreateAPIView):
    serializer_class = StaffCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # only superusers (owners) can add staff
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only superusers can add staff."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
