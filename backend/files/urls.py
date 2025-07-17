from django.urls import path
from .views import FileUploadListCreateView, FileUploadDeleteView

urlpatterns = [
    path('files/', FileUploadListCreateView.as_view(), name='file-list-create'),
    path('files/<int:pk>/', FileUploadDeleteView.as_view(), name='file-delete'),
] 