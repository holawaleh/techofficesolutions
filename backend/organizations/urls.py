from django.urls import path
from .views import AddStaffView

urlpatterns = [
    path("add-staff/", AddStaffView.as_view(), name="add-staff"),
]
