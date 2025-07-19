"use client";
import Logo from './Logo';
import { useState, MouseEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Pencil } from 'lucide-react';
import { Transition } from '@headlessui/react';
import React from 'react';

interface Chat {
  id: number;
  title: string;
  lastMessage?: string;
}

interface SidebarProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onDeleteChat: (id: number) => void;
  onLogoClick?: () => void;
  onRenameChat?: (id: number, newTitle: string) => void;
  onProfileClick?: () => void;
}

export default function SidebarWithToggle({ chats = [], selectedChatId, onSelectChat, onDeleteChat, onLogoClick, onRenameChat, onProfileClick }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing
  React.useEffect(() => {
    if (editingId !== null) inputRef.current?.focus();
  }, [editingId]);

  const handleRename = (id: number, title: string) => {
    setEditingId(id);
    setEditValue(title);
  };

  const handleRenameSave = (id: number) => {
    if (onRenameChat && editValue.trim()) {
      onRenameChat(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDeleteChat(deleteId);
      setDeleteId(null);
    }
  };

  const chatLinks = (
    <ul className="space-y-2 mt-8">
      {chats.map(chat => (
        <motion.li
          key={chat.id}
          initial={{ scale: 1, boxShadow: 'none' }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 16px #8B5CF6' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex flex-col group rounded-2xl"
        >
          <div className="flex items-center">
            {editingId === chat.id ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => handleRenameSave(chat.id)}
                onKeyDown={e => { if (e.key === 'Enter') handleRenameSave(chat.id); if (e.key === 'Escape') setEditingId(null); }}
                className="flex-1 px-2 py-1 rounded-lg bg-glass2 border border-white/10 text-violet font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-glass text-base transition"
                maxLength={32}
                aria-label="Rename chat"
              />
            ) : (
              <button
                onClick={() => onSelectChat(chat.id)}
                className={`flex-1 text-left px-4 py-3 rounded-2xl bg-gradient-to-br from-glass to-glass2 border border-white/10 backdrop-blur-md shadow-lg font-bold transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-glass text-base
                  ${selectedChatId === chat.id ? 'ring-2 ring-violet shadow-[0_0_10px_#8B5CF6] text-violet' : 'text-gray-100 hover:ring-2 hover:ring-cyan hover:shadow-[0_0_10px_#22D3EE] hover:text-cyan'}`}
                tabIndex={0}
                onDoubleClick={() => handleRename(chat.id, chat.title)}
                aria-label={`Select chat: ${chat.title}`}
              >
                <span className="truncate flex-1">{chat.title}</span>
              </button>
            )}
            <button
              onClick={(e: MouseEvent) => { e.stopPropagation(); handleRename(chat.id, chat.title); }}
              className="ml-2 p-1 rounded-full hover:bg-blue-700/80 transition group-hover:opacity-100 opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-glass"
              aria-label="Rename chat"
              tabIndex={0}
            >
              <Pencil className="w-4 h-4 text-blue-400 group-hover:text-cyan-400 transition" />
            </button>
            <button
              onClick={(e: MouseEvent) => { e.stopPropagation(); setDeleteId(chat.id); }}
              className="ml-2 p-1 rounded-full hover:bg-purple-700/80 transition group-hover:opacity-100 opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-glass"
              aria-label="Delete chat"
              tabIndex={0}
            >
              <Trash2 className="w-4 h-4 text-purple-400 group-hover:text-red-400 transition" />
            </button>
          </div>
          {/* Last message preview */}
          {/* {chat.lastMessage && (
            <div className="ml-2 mt-1 text-xs text-gray-400 truncate max-w-[90%] group-hover:text-cyan transition-all duration-200">
              {chat.lastMessage.length > 48 ? chat.lastMessage.slice(0, 48) + '…' : chat.lastMessage}
            </div>
          )} */}
        </motion.li>
      ))}
    </ul>
  );

  // Avatar logic for mobile sidebar
  const [userInitial, setUserInitial] = useState('U');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const MEDIA_URL = "http://localhost:8000/media/";
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      if (email && email.length > 0) setUserInitial(email[0].toUpperCase());
      const avatar = localStorage.getItem('userAvatar');
      if (avatar) setUserAvatar(avatar);
      else {
        const token = localStorage.getItem('accessToken');
        if (token) {
          fetch('http://localhost:8000/api/auth/profile/', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
              if (data && data.avatar) {
                setUserAvatar(data.avatar);
                localStorage.setItem('userAvatar', data.avatar);
              }
            });
        }
      }
    }
  }, []);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-glass p-2 rounded-full text-gray-200 shadow-lg backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-glass hover:bg-violet/70 transition"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        tabIndex={0}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-68 bg-gradient-to-br from-glass to-glass2 border-r border-white/10 flex-col p-6 z-20 backdrop-blur-md shadow-2xl">
        <Logo onClick={onLogoClick} />
        <nav className="flex-1 my-8">{chatLinks}</nav>
      </aside>
      {/* Sidebar drawer for mobile */}
      <Transition show={open} as={React.Fragment}>
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setOpen(false)} />
          <aside className="relative w-11/12 max-w-xs h-full bg-gradient-to-br from-glass to-glass2 border-r border-white/10 flex flex-col p-6 z-50 backdrop-blur-md shadow-2xl">
            {/* Profile avatar for mobile */}
            <button
              className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white/20 focus:outline-none overflow-hidden"
              onClick={() => { setOpen(false); onProfileClick && onProfileClick(); }}
              aria-label="User menu"
            >
              {userAvatar ? (
                <img src={userAvatar.startsWith('http') ? userAvatar : MEDIA_URL + userAvatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-2xl">{userInitial}</span>
              )}
            </button>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-glass p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-glass"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
              tabIndex={0}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <Logo onClick={onLogoClick} />
            <nav className="flex-1 overflow-y-auto custom-scrollbar">{chatLinks}</nav>
          </aside>
        </div>
      </Transition>
      {/* Delete confirmation modal */}
      <Transition show={deleteId !== null} as={React.Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-white/10 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-white">Delete Chat?</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-xl bg-gray-700 text-gray-200 font-bold hover:bg-gray-600 transition"
                onClick={() => setDeleteId(null)}
              >Cancel</button>
              <button
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold hover:from-red-700 hover:to-purple-700 transition"
                onClick={handleDeleteConfirm}
              >Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
} 