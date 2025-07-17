from rest_framework import serializers

# PUBLIC_INTERFACE
class EmployeeSerializer(serializers.Serializer):
    """Serializer for employee objects."""
    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(max_length=128)
    email = serializers.EmailField()
    department = serializers.CharField(max_length=64)
    position = serializers.CharField(max_length=64)
    phone = serializers.CharField(max_length=24)
    address = serializers.CharField(max_length=256)
    # Add more fields as needed

    # Validation
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value

    def validate_email(self, value):
        if not value.strip():
            raise serializers.ValidationError("Email cannot be empty.")
        return value
