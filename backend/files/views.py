from django.shortcuts import render
from rest_framework import generics, permissions
from .models import FileUpload
from .serializers import FileUploadSerializer

# Create your views here.

class FileUploadListCreateView(generics.ListCreateAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FileUpload.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, filename=self.request.data.get('filename', ''))

class FileUploadDeleteView(generics.DestroyAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return FileUpload.objects.filter(user=self.request.user)
