from rest_framework import serializers
from .models import OCRDocument

class OCRDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OCRDocument
        fields = '__all__' 