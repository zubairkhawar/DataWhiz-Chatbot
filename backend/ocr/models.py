from django.db import models
from django.conf import settings

# Create your models here.

class OCRDocument(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ocr_documents')
    file = models.FileField(upload_to='ocr_uploads/')
    filename = models.CharField(max_length=255)
    extracted_text = models.TextField(blank=True, null=True)
    extracted_data = models.JSONField(blank=True, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey('chat.Chat', on_delete=models.SET_NULL, null=True, blank=True, related_name='ocr_documents')
    message = models.ForeignKey('chat.Message', on_delete=models.SET_NULL, null=True, blank=True, related_name='ocr_documents')
    tags = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.filename
