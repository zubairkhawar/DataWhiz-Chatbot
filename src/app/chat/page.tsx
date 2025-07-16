"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import FileUpload from "@/components/FileUpload";
import ChatWindow from "@/components/ChatWindow";
import SidebarWithToggle from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Rocket, Plus } from 'lucide-react';
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

// Chat data type
interface ChatData {
  id: number;
  title: string;
  messages: { id: number; sender: 'user' | 'bot'; text: string }[];
  file: File | null;
}

function ProfilePage() {
  // Placeholder user info
  return (
    <div className="max-w-lg mx-auto mt-16 bg-gray-900/80 rounded-3xl shadow-2xl p-10 border border-white/10 backdrop-blur-xl flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-md border-2 border-white/20 mb-2">
        DW
      </div>
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 tracking-tight drop-shadow-lg mb-2">User Profile</h2>
      <div className="w-full flex flex-col gap-3 text-gray-200">
        <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>user@example.com</span></div>
        <div className="flex justify-between"><span className="font-semibold">Joined:</span> <span>2024-05-01</span></div>
      </div>
      <button className="mt-4 px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-bold shadow-lg transition-all duration-200 border-none">Change Password</button>
    </div>
  );
}

export default function ChatDashboard() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatData[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatCounter, setChatCounter] = useState(1);
  const [view, setView] = useState<'main' | 'profile' | 'chat'>('main');

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("auth") !== "true") {
      router.replace("/signin");
    }
  }, [router]);

  // Add new chat and select it
  const handleNewChat = () => {
    const newChat: ChatData = {
      id: chatCounter,
      title: `Chat ${chatCounter}`,
      messages: [
        { id: 1, sender: 'bot', text: 'Hello! Upload a file or ask a question about your data.' },
      ],
      file: null,
    };
    setChats(prev => [...prev, newChat]);
    setSelectedChatId(chatCounter);
    setChatCounter(c => c + 1);
    setView('chat');
  };

  // Select a chat
  const handleSelectChat = (id: number) => {
    setSelectedChatId(id);
    setView('chat');
  };

  // Update file for a chat
  const handleFileUpload = (file: File) => {
    setChats(prev => prev.map(chat =>
      chat.id === selectedChatId ? { ...chat, file } : chat
    ));
  };

  // Add message to a chat
  const handleSendMessage = (text: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== selectedChatId) return chat;
      const nextId = chat.messages.length ? Math.max(...chat.messages.map(m => m.id)) + 1 : 1;
      return {
        ...chat,
        messages: [
          ...chat.messages,
          { id: nextId, sender: 'user', text },
          { id: nextId + 1, sender: 'bot', text: 'This is a placeholder response.' },
        ],
      };
    }));
  };

  // Delete a chat
  const handleDeleteChat = (id: number) => {
    setChats(prev => prev.filter(chat => chat.id !== id));
    if (selectedChatId === id) {
      // If the deleted chat was selected, select another or clear selection
      const remaining = chats.filter(chat => chat.id !== id);
      if (remaining.length) {
        setSelectedChatId(remaining[0].id);
        setView('chat');
      } else {
        setSelectedChatId(null);
        setView('main');
      }
    }
  };

  // Handle chat rename
  const handleRenameChat = (id: number, newTitle: string) => {
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, title: newTitle } : chat));
  };

  // Get selected chat
  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  return (
    <DashboardLayout
      sidebar={
        <SidebarWithToggle
          chats={chats.map(chat => ({
            ...chat,
            lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : '',
          }))}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onLogoClick={() => setView('main')}
          onRenameChat={handleRenameChat}
        />
      }
      topbar={<Topbar onProfileClick={() => setView('profile')} />}
    >
      {/* Main info page if no chat selected and not in profile view */}
      {view === 'main' && (
        <motion.section
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center min-h-[60vh]"
        >
          <div className="relative rounded-3xl p-1 bg-gradient-to-br from-glass to-glass2 shadow-2xl max-w-6xl w-full border-none border-white/10 backdrop-blur-md">
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-violet via-cyan to-purple animate-pulse rounded-b-xl opacity-80" />
            <div className="relative bg-transparent rounded-3xl p-10 flex flex-col items-center gap-8">
              <div className="mb-2 flex justify-center w-full">
                <Logo />
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet via-cyan to-purple drop-shadow-lg text-center mb-2 font-sans">
                Chat with Your Data
              </h1>
              <p className="text-xl text-gray-300 font-medium text-center max-w-2xl mb-2 font-sans">
                DataWhiz lets you upload your spreadsheets or JSON files and instantly get answers, summaries, and charts—just by chatting.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-2">
                <div className="flex flex-col items-center text-center gap-2">
                  <span className="bg-gradient-to-tr from-violet to-cyan p-3 rounded-full shadow-neon-violet">
                    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/></svg>
                  </span>
                  <span className="font-semibold text-gray-100 font-sans">Upload Data</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wider">CSV, Excel, or JSON</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <span className="bg-gradient-to-tr from-cyan to-purple p-3 rounded-full shadow-neon-cyan">
                    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
                  </span>
                  <span className="font-semibold text-gray-100 font-sans">Ask Anything</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Natural language Q&A</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <span className="bg-gradient-to-tr from-purple to-violet p-3 rounded-full shadow-neon-purple">
                    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12h8M12 8v8"/></svg>
                  </span>
                  <span className="font-semibold text-gray-100 font-sans">Get Insights</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Answers, summaries, charts</span>
                </div>
              </div>
              <button
                className="mt-8 px-10 py-4 rounded-2xl bg-gradient-to-br from-violet via-cyan to-purple shadow-lg hover:shadow-[0_0_20px_#8B5CF6] text-white font-bold text-xl flex items-center gap-3 hover:scale-105 transition-all duration-200 border-none self-center focus:outline-none"
                onClick={handleNewChat}
              >
                <Rocket className="w-6 h-6 animate-bounce" />
                Get Started
              </button>
            </div>
          </div>
        </motion.section>
      )}
      {/* Profile page */}
      {view === 'profile' && <ProfilePage />}
      {/* Chat area if a chat is selected and not in profile view */}
      {view === 'chat' && selectedChat && (
        <>
          <FileUpload
            file={selectedChat.file}
            onFileUpload={handleFileUpload}
          />
          <div className="mt-8">
            <ChatWindow
              messages={selectedChat.messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </>
      )}
      <AnimatePresence>
        <motion.button
          key="fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={handleNewChat}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-violet to-cyan shadow-neon-violet hover:shadow-neon-cyan text-white p-5 rounded-full flex items-center justify-center text-3xl hover:scale-105 transition-transform duration-200 focus:outline-none border-2 border-white/10 focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-glass md:bottom-8 md:right-8 sm:bottom-4 sm:right-4"
          aria-label="New Chat"
          tabIndex={0}
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </AnimatePresence>
    </DashboardLayout>
  );
} 