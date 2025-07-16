'use client';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopbarProps {
  onProfileClick: () => void;
}

export default function Topbar({ onProfileClick }: TopbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      if (email && email.length > 0) {
        setUserInitial(email[0].toUpperCase());
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('userEmail');
    router.replace('/signin');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="fixed left-64 top-0 right-0 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 flex items-center px-8 z-10 shadow-lg">
      {/* Animated gradient accent bar at the top */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse rounded-b-xl opacity-80" />
      <div className="flex-1 text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 drop-shadow-lg">
        DataWhiz
      </div>
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Avatar dropdown */}
        <button
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white/20 focus:outline-none"
          onClick={() => setDropdownOpen(v => !v)}
          aria-label="User menu"
        >
          <span className="text-xl">{userInitial}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-14 min-w-[160px] bg-gray-900/95 rounded-xl shadow-xl border border-white/10 py-2 z-50 animate-fade-in">
            <button
              className="w-full text-left px-5 py-2 text-gray-100 hover:bg-blue-600/80 rounded-lg transition font-medium"
              onClick={() => { setDropdownOpen(false); onProfileClick(); }}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-5 py-2 text-gray-100 hover:bg-red-600/80 rounded-lg transition font-medium"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 