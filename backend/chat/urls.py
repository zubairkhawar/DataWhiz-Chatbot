from django.urls import path
from .views import ChatListCreateView, ChatDeleteView, MessageListCreateView

urlpatterns = [
    path('chats/', ChatListCreateView.as_view(), name='chat-list-create'),
    path('chats/<int:pk>/', ChatDeleteView.as_view(), name='chat-delete'),
    path('chats/<int:chat_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
] 