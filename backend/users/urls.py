from django.urls import path
from .views import SignupView, CustomTokenObtainPairView, StaffCreateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),  # 👈 now uses custom
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("staff/create/", StaffCreateView.as_view(), name="staff_create"),
]
