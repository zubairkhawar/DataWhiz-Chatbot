from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from files.models import FileUpload
from files.serializers import FileUploadSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatDeleteView(generics.DestroyAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)

class ChatUpdateView(generics.UpdateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        return Message.objects.filter(chat__id=chat_id, chat__user=self.request.user).order_by('created_at')

    def post(self, request, *args, **kwargs):
        print('DEBUG POST DATA:', request.data)
        print('DEBUG POST FILES:', request.FILES)
        chat_id = self.kwargs['chat_id']
        # Create the message first
        message_serializer = MessageSerializer(data={
            'chat': chat_id,
            'user': request.user.id,
            'content': request.data.get('content', ''),
            'sender': request.data.get('sender', 'user'),
        })
        message_serializer.is_valid(raise_exception=True)
        message = message_serializer.save(user=request.user, chat_id=chat_id)

        # Handle file uploads (one or multiple)
        files = request.FILES.getlist('files') or request.FILES.getlist('file')
        file_objs = []
        for f in files:
            file_obj = FileUpload.objects.create(
                user=request.user,
                chat_id=chat_id,
                message=message,
                file=f,
                filename=f.name
            )
            file_objs.append(file_obj)
        response_data = message_serializer.data
        response_data['files'] = FileUploadSerializer(file_objs, many=True).data
        return Response(response_data, status=status.HTTP_201_CREATED)
