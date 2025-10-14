from django.urls import path
from .views import AddStaffView,StaffListView,OrganizationProfileView, SetPreferencesView

urlpatterns = [
    path("add-staff/", AddStaffView.as_view(), name="add-staff"),
    path("staff/", StaffListView.as_view(), name="staff-list"),
    path("profile/", OrganizationProfileView.as_view(), name="org-profile"),
    path("set-preferences/", SetPreferencesView.as_view(), name="set-preferences"),


]
