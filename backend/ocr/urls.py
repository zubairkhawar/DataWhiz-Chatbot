from django.urls import path
from .views import OCRDocumentUploadView, OCRDocumentDetailView, OCRDocumentExportView, OCRDocumentDownloadView, OCRDocumentByMessageView

urlpatterns = [
    path('upload/', OCRDocumentUploadView.as_view(), name='ocr-upload'),
    path('doc/<int:pk>/', OCRDocumentDetailView.as_view(), name='ocr-detail'),
    path('doc/<int:pk>/export/<str:fmt>/', OCRDocumentExportView.as_view(), name='ocr-export'),
    path('doc/<int:pk>/download/', OCRDocumentDownloadView.as_view(), name='ocr-download'),
    path('message/<int:message_id>/', OCRDocumentByMessageView.as_view(), name='ocr-by-message'),
] 