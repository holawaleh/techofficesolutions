from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import StaffCreateSerializer
from .models import Membership
from users.models import User


class AddStaffView(generics.CreateAPIView):
    """
    Allows a superuser (organization owner) to add new staff.
    """
    serializer_class = StaffCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
    # Only organization owners (role=OWNER) can add staff
        if not Membership.objects.filter(user=request.user, role=Membership.Role.OWNER).exists():
         return Response(
            {"detail": "Only organization owners can add staff."},
            status=status.HTTP_403_FORBIDDEN
        )
        return super().create(request, *args, **kwargs)

class StaffListView(generics.ListAPIView):
    """
    List all staff members belonging to the signed-in superuser’s organization.
    """
    serializer_class = StaffCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        org = getattr(user, "current_org", None)
        if org:
            return Membership.objects.filter(organization=org).select_related("user")
        return Membership.objects.none()
    
class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        org = getattr(request.user, "current_org", None)
        if not org:
            return Response({"detail": "No organization found."}, status=404)
        return Response({
            "name": org.name,
            "preference": org.preference,
            "owner": org.owner.username,
            "created_at": org.created_at,
        })
class SetPreferencesView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        preferences = request.data.get("preferences", [])
        email = request.data.get("user_email")

        if not email or not preferences:
            return Response({"detail": "Email and preferences required."}, status=400)

        try:
            user = User.objects.get(email=email)
            org = user.current_org
            org.preference = preferences
            org.save()
            return Response({"message": "Preferences saved successfully."}, status=200)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
