from rest_framework import serializers
from .models import Chat, Message
from files.serializers import FileUploadSerializer

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'user', 'title', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    files = FileUploadSerializer(many=True, read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'chat', 'user', 'content', 'sender', 'created_at', 'files']
        read_only_fields = ['id', 'created_at'] 