"use client";
import Logo from './Logo';
import { useState, MouseEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
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
}

export default function SidebarWithToggle({ chats = [], selectedChatId, onSelectChat, onDeleteChat, onLogoClick, onRenameChat }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
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
              onClick={(e: MouseEvent) => { e.stopPropagation(); onDeleteChat(chat.id); }}
              className="ml-2 p-1 rounded-full hover:bg-purple-700/80 transition group-hover:opacity-100 opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-glass"
              aria-label="Delete chat"
              tabIndex={0}
            >
              <Trash2 className="w-4 h-4 text-purple-400 group-hover:text-red-400 transition" />
            </button>
          </div>
          {/* Last message preview */}
          {chat.lastMessage && (
            <div className="ml-2 mt-1 text-xs text-gray-400 truncate max-w-[90%] group-hover:text-cyan transition-all duration-200">
              {chat.lastMessage.length > 48 ? chat.lastMessage.slice(0, 48) + '…' : chat.lastMessage}
            </div>
          )}
        </motion.li>
      ))}
    </ul>
  );

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
    </>
  );
} 