from rest_framework import serializers
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'user', 'title', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat', 'user', 'content', 'sender', 'created_at', 'file']
        read_only_fields = ['id', 'user', 'created_at'] 