import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

function renderMessageText(text: string) {
  // Simple code block detection: wrap text in ``` for code
  if (text.startsWith('```') && text.endsWith('```')) {
    return (
      <pre className="bg-gray-900 text-green-400 font-mono px-4 py-3 rounded-md shadow-inner border border-cyan/30 whitespace-pre-wrap overflow-x-auto text-sm mt-2">
        {text.replace(/```/g, '')}
      </pre>
    );
  }
  return <span>{text}</span>;
}

function TypingEffect({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <span>
      {displayed}
      <span className="inline-block w-2 h-5 align-middle animate-pulse bg-cyan-400 ml-1 rounded-sm" style={{ verticalAlign: 'baseline' }} />
    </span>
  );
}

export default function ChatWindow({ messages, onSendMessage }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  // Find the last bot message index
  const lastBotIdx = [...messages].reverse().findIndex(m => m.sender === 'bot');
  const lastBotAbsIdx = lastBotIdx === -1 ? -1 : messages.length - 1 - lastBotIdx;

  return (
    <div className="relative flex flex-col h-[60vh] max-h-[70vh] bg-gradient-to-br from-glass to-glass2 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md border border-white/10">
      {/* Animated gradient accent bar */}
      <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-violet via-cyan to-purple animate-pulse rounded-b-xl opacity-80 z-10" />
      {/* Animated gradient border */}
      <div className="pointer-events-none absolute -inset-1 rounded-3xl z-0 bg-gradient-to-tr from-violet via-cyan to-purple opacity-40 blur-sm animate-pulse" />
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-5 py-4 rounded-2xl max-w-xl break-words shadow-lg border border-white/10 font-sans flex items-start gap-3
                  ${msg.sender === 'user'
                    ? 'bg-gradient-to-br from-violet/80 to-cyan/70 text-white shadow-neon-violet'
                    : 'bg-gradient-to-br from-glass to-glass2 text-cyan-200 shadow-neon-cyan'}
                `}
              >
                <span className="mt-1">
                  {msg.sender === 'user' ? (
                    <User className="w-5 h-5 text-violet-300" />
                  ) : (
                    <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
                  )}
                </span>
                <div className="flex-1 text-base leading-relaxed">
                  {/* Typing effect only for the last bot message */}
                  {msg.sender === 'bot' && idx === lastBotAbsIdx ? (
                    <TypingEffect text={msg.text} />
                  ) : (
                    renderMessageText(msg.text)
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSend} className="flex items-center p-4 border-t border-white/10 bg-glass2/80 relative z-10">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-2xl bg-glass text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet border border-white/10 shadow-inner font-sans text-base"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-violet via-cyan to-purple shadow-lg hover:shadow-[0_0_20px_#8B5CF6] text-white font-bold shadow-neon-violet hover:scale-105 transition-all duration-200 border-none text-base focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
} 