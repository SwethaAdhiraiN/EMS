from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import EmployeeSerializer
from .json_store import (
    get_all_employees,
    get_employee_by_id,
    add_employee,
    update_employee,
    delete_employee
)

# PUBLIC_INTERFACE
class EmployeeListCreateView(APIView):
    """Handles listing all employees and creating a new employee."""
    permission_classes = [permissions.IsAuthenticated]

    # PUBLIC_INTERFACE
    def get(self, request):
        """List all employees, supports optional filtering by name or department."""
        employees = get_all_employees()
        name_query = request.query_params.get('search', '').lower()
        department_filter = request.query_params.get('department', '')
        if name_query:
            employees = [
                emp for emp in employees
                if name_query in emp["name"].lower()
                or name_query in emp.get("email", "").lower()
                or name_query in emp.get("department", "").lower()
            ]
        if department_filter:
            employees = [
                emp for emp in employees if emp.get("department", "").lower() == department_filter.lower()
            ]
        return Response(employees, status=status.HTTP_200_OK)

    # PUBLIC_INTERFACE
    def post(self, request):
        """Add a new employee."""
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            saved = add_employee(serializer.validated_data)
            return Response(saved, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# PUBLIC_INTERFACE
class EmployeeDetailView(APIView):
    """Handles retrieve, update, and delete of single employee."""
    permission_classes = [permissions.IsAuthenticated]

    # PUBLIC_INTERFACE
    def get(self, request, pk):
        emp = get_employee_by_id(pk)
        if not emp:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(emp)

    # PUBLIC_INTERFACE
    def put(self, request, pk):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            updated = update_employee(pk, serializer.validated_data)
            if updated:
                return Response(updated)
            else:
                return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUBLIC_INTERFACE
    def delete(self, request, pk):
        deleted = delete_employee(pk)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
