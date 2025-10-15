from django.urls import path
from .views import SignupView, ChangePasswordView, CurrentUserView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
]
