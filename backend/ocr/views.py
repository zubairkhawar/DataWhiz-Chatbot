from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import OCRDocument
from .serializers import OCRDocumentSerializer
from django.conf import settings
import pytesseract
from PIL import Image
import pillow_heif
from pdf2image import convert_from_path
import os
import tempfile
import pandas as pd
from rest_framework.views import APIView
from django.http import FileResponse, JsonResponse
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class OCRDocumentUploadView(generics.CreateAPIView):
    serializer_class = OCRDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        filename = file.name
        user = request.user
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[-1]) as tmp:
            for chunk in file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        extracted_text = ''
        extracted_data = None
        try:
            ext = filename.lower().split('.')[-1]
            if ext in ['jpg', 'jpeg', 'png']:
                img = Image.open(tmp_path)
                extracted_text = pytesseract.image_to_string(img)
            elif ext == 'heic':
                heif_file = pillow_heif.read_heif(tmp_path)
                img = Image.frombytes(
                    heif_file.mode, heif_file.size, heif_file.data,
                    "raw"
                )
                extracted_text = pytesseract.image_to_string(img)
            elif ext == 'pdf':
                images = convert_from_path(tmp_path)
                extracted_text = '\n'.join([pytesseract.image_to_string(img) for img in images])
            else:
                os.unlink(tmp_path)
                return Response({'error': 'Unsupported file type.'}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        # Save OCRDocument
        doc = OCRDocument.objects.create(
            user=user,
            file=file,
            filename=filename,
            extracted_text=extracted_text,
            extracted_data=extracted_data,
            chat_id=request.data.get('chat'),
            message_id=request.data.get('message'),
            tags=request.data.get('tags', '')
        )
        return Response(OCRDocumentSerializer(doc).data, status=status.HTTP_201_CREATED)

class OCRDocumentDetailView(generics.RetrieveUpdateAPIView):
    queryset = OCRDocument.objects.all()
    serializer_class = OCRDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OCRDocument.objects.filter(user=self.request.user)

class OCRDocumentExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pk, fmt):
        doc = OCRDocument.objects.filter(user=request.user, pk=pk).first()
        if not doc or not doc.extracted_text:
            return Response({'error': 'No data to export.'}, status=404)
        # For demo: treat each line as a row, split by whitespace for columns
        lines = [line.strip() for line in doc.extracted_text.split('\n') if line.strip()]
        rows = [line.split() for line in lines]
        df = pd.DataFrame(rows)
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{fmt}') as tmp:
            if fmt == 'csv':
                df.to_csv(tmp.name, index=False, header=False)
            elif fmt == 'json':
                df.to_json(tmp.name, orient='records')
            elif fmt in ['xls', 'xlsx']:
                df.to_excel(tmp.name, index=False, header=False)
            else:
                return Response({'error': 'Unsupported export format.'}, status=400)
            tmp.flush()
            tmp.seek(0)
            response = FileResponse(open(tmp.name, 'rb'), as_attachment=True, filename=f'{doc.filename}.{fmt}')
        os.unlink(tmp.name)
        return response

class OCRDocumentDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pk):
        doc = OCRDocument.objects.filter(user=request.user, pk=pk).first()
        if not doc:
            return Response({'error': 'File not found.'}, status=404)
        return FileResponse(doc.file, as_attachment=True, filename=doc.filename)

class OCRDocumentByMessageView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, message_id):
        doc = OCRDocument.objects.filter(user=request.user, message_id=message_id).first()
        if not doc:
            return Response({'error': 'No extracted data found for this message.'}, status=404)
        return Response(OCRDocumentSerializer(doc).data)
