from django.db import models
from django.conf import settings

# Create your models here.

class FileUpload(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files')
    chat = models.ForeignKey('chat.Chat', on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    message = models.ForeignKey('chat.Message', on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    file = models.FileField(upload_to='uploads/')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename
