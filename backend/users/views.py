from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .serializers import SignupSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Signup successful! Superuser and organization created."},
                        status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "company_name": getattr(user, "company_name", None),
        })

class ChangePasswordView(APIView):
    """
    Allows authenticated users to change their password securely.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not all([old_password, new_password, confirm_password]):
            return Response({"detail": "All fields are required."}, status=400)

        if not user.check_password(old_password):
            return Response({"detail": "Old password is incorrect."}, status=400)

        if new_password != confirm_password:
            return Response({"detail": "Passwords do not match."}, status=400)

        if len(new_password) < 6:
            return Response({"detail": "Password too short. Minimum 6 characters."}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully."}, status=200)