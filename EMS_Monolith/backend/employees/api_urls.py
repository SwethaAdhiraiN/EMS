from django.urls import path
from .views import (
    EmployeeListCreateView,
    EmployeeDetailView
)

urlpatterns = [
    path('', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('<uuid:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
]
