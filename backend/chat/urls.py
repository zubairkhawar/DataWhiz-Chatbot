from django.urls import path
from .views import ChatListCreateView, ChatDeleteView, ChatUpdateView, MessageListCreateView

urlpatterns = [
    path('chats/', ChatListCreateView.as_view(), name='chat-list-create'),
    path('chats/<int:pk>/', ChatDeleteView.as_view(), name='chat-delete'),
    path('chats/<int:pk>/rename/', ChatUpdateView.as_view(), name='chat-rename'),
    path('chats/<int:chat_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
] 