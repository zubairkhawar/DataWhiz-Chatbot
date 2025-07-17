from rest_framework import serializers
from .models import FileUpload

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ['id', 'user', 'chat', 'message', 'file', 'filename', 'uploaded_at']
        read_only_fields = ['id', 'user', 'uploaded_at'] 