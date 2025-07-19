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
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Chat data type
interface MessageData {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  files?: { id: number; filename: string; file: string }[];
}
interface ChatData {
  id: number;
  title: string;
  messages: MessageData[];
  file: File | null;
}

function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const MEDIA_URL = "http://localhost:8000/media/"; // Adjust if your backend media URL is different
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('http://localhost:8000/api/auth/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
        // Store avatar in localStorage for Topbar
        if (data.avatar) localStorage.setItem('userAvatar', data.avatar);
        else localStorage.removeItem('userAvatar');
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg("");
    setPwLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8000/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPw,
          new_password: newPw,
          new_password2: newPw2,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Password change failed');
      setPwMsg('Password changed successfully!');
      setOldPw(""); setNewPw(""); setNewPw2("");
      setShowChangePw(false);
      setShowSuccess(true); // Show success popup
      setTimeout(() => setShowSuccess(false), 2000); // Hide after 2s
    } catch (err: any) {
      setPwMsg(err.message || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8000/api/auth/delete-account/', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete account');
      // Log out and redirect
      localStorage.clear();
      router.replace('/signin');
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-16 bg-gray-900/80 rounded-3xl shadow-2xl p-10 border border-white/10 backdrop-blur-xl flex flex-col items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-md border-2 border-white/20 mb-2 overflow-hidden">
        {profile?.avatar ? (
          <img src={profile.avatar.startsWith('http') ? profile.avatar : MEDIA_URL + profile.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <span>{profile?.first_name?.[0] || profile?.email?.[0] || 'U'}</span>
        )}
      </div>
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 tracking-tight drop-shadow-lg mb-2">User Profile</h2>
      <div className="w-full flex flex-col gap-3 text-gray-200">
        <div className="flex justify-between"><span className="font-semibold">First Name:</span> <span>{profile?.first_name}</span></div>
        <div className="flex justify-between"><span className="font-semibold">Last Name:</span> <span>{profile?.last_name}</span></div>
        <div className="flex justify-between"><span className="font-semibold">Username:</span> <span>{profile?.username || <span className="text-gray-500">(none)</span>}</span></div>
        <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>{profile?.email}</span></div>
        <div className="flex justify-between"><span className="font-semibold">Joined:</span> <span>{profile?.date_joined ? profile.date_joined.split('T')[0] : ''}</span></div>
      </div>
      <button
        className="mt-4 px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-bold shadow-lg transition-all duration-200 border-none"
        onClick={() => setShowChangePw(true)}
      >
        Change Password
      </button>
      {/* Delete Account Button */}
      <button
        className="mt-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold shadow-lg transition-all duration-200 border-none"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={deleteLoading}
      >
        {deleteLoading ? 'Deleting...' : 'Delete Account'}
      </button>
      {deleteError && <div className="text-red-400 text-sm mt-2">{deleteError}</div>}
      <AnimatePresence>
        {showChangePw && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onSubmit={handleChangePassword}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-md mx-auto rounded-3xl bg-gradient-to-br from-glass to-glass2 border border-white/10 shadow-2xl p-8 backdrop-blur-md flex flex-col items-center gap-6">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-glass p-2 rounded-full focus:outline-none"
                onClick={() => setShowChangePw(false)}
                type="button"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-2">Change Password</h3>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                placeholder="Old Password"
                value={oldPw}
                onChange={e => setOldPw(e.target.value)}
                required
                disabled={pwLoading}
              />
              <input
                type="password"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                placeholder="New Password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                required
                disabled={pwLoading}
              />
              <input
                type="password"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                placeholder="Confirm New Password"
                value={newPw2}
                onChange={e => setNewPw2(e.target.value)}
                required
                disabled={pwLoading}
              />
              {pwMsg && <div className="text-center text-sm text-red-400">{pwMsg}</div>}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition-all duration-200 border-none flex items-center justify-center gap-2"
                disabled={pwLoading}
              >
                {pwLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-lg"
          >
            Password changed successfully!
          </motion.div>
        )}
      </AnimatePresence>
      <Transition show={showDeleteConfirm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteConfirm(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md mx-auto rounded-3xl bg-gradient-to-br from-glass to-glass2 border border-white/10 shadow-2xl p-8 backdrop-blur-md flex flex-col items-center gap-6">
              <Dialog.Title className="text-xl font-bold text-red-400 mb-2">Delete Account?</Dialog.Title>
              <p className="text-gray-200 text-center mb-4">Are you sure you want to delete your account? <br/>This action cannot be undone and will delete all your data.</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  className="px-6 py-2 rounded-xl bg-gray-700 text-gray-200 font-bold hover:bg-gray-600 transition"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                >Cancel</button>
                <button
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold hover:from-red-700 hover:to-purple-700 transition"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >{deleteLoading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
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
        {
          id: 1,
          sender: 'bot',
          text: `👋 Hello! I’m DataWhiz AI — your intelligent assistant for extracting, analyzing, and reporting your business data.\n\nUpload an image, screenshot, or PDF — and I’ll help you:\n• Extract tables or lists into structured CSV or Excel\n• Generate insights and downloadable reports\n• Answer any questions from your uploaded files.`
        }
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

  // Update file for a chat and show file received/extraction messages
  const handleFileUpload = (file: File) => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== selectedChatId) return chat;
      const nextId = chat.messages.length ? Math.max(...chat.messages.map(m => m.id)) + 1 : 1;
      // Add file received message
      const newMessages = [
        ...chat.messages,
        {
          id: nextId,
          sender: 'bot' as 'bot',
          text: `✅ File received! Extracting data now...\nThis may take a few seconds depending on the file size and content.`
        }
      ];
      // Simulate extraction complete after a short delay
      setTimeout(() => {
        setChats(current => current.map(c => {
          if (c.id !== chat.id) return c;
          const nextId2 = newMessages.length ? Math.max(...newMessages.map(m => m.id)) + 1 : 1;
          return {
            ...c,
            messages: [
              ...newMessages,
              {
                id: nextId2,
                sender: 'bot' as 'bot',
                text: `📊 Data extracted successfully. You can now:\n• 💬 Ask me questions like “What was the total sales last month?”\n• 📁 Download as CSV, Excel, or PDF report\n• 📈 Generate insights and visual summaries.`
              }
            ]
          };
        }));
      }, 1500);
      return { ...chat, file, messages: newMessages };
    }));
  };

  // Update handleSendMessage to support files
  const handleSendMessage = async (text: string, files: File[]) => {
    if (!selectedChatId) return;
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('content', text);
    formData.append('sender', 'user');
    files.forEach(f => formData.append('files', f));
    const res = await fetch(`http://localhost:8000/api/chat/chats/${selectedChatId}/messages/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      // handle error (show toast, etc)
      return;
    }
    const data = await res.json();
    setChats(prev => prev.map(chat => {
      if (chat.id !== selectedChatId) return chat;
      const nextId = chat.messages.length ? Math.max(...chat.messages.map(m => m.id)) + 1 : 1;
      return {
        ...chat,
        messages: [
          ...chat.messages,
          { id: nextId, sender: 'user', text, files: data.files },
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
  const handleRenameChat = async (id: number, newTitle: string) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:8000/api/chat/chats/${id}/rename/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!res.ok) {
      // handle error (show toast, etc)
      return;
    }
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, title: newTitle } : chat));
  };

  // Get selected chat
  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  // Overlay click to close profile modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setView('main');
    }
  };

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
          onProfileClick={() => setView('profile')}
        />
      }
      topbar={<div className="hidden md:flex"><Topbar onProfileClick={() => setView('profile')} /></div>}
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
      {view === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleOverlayClick}>
          <ProfilePage />
        </div>
      )}
      {/* Chat area if a chat is selected and not in profile view */}
      {view === 'chat' && selectedChat && (
        <>
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
          <Plus className="w-6 h-6" />
        </motion.button>
      </AnimatePresence>
    </DashboardLayout>
  );
} 