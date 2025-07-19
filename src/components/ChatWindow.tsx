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
  onSendMessage: (text: string, files: File[]) => void;
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

// MessageActions component stub
function MessageActions({ messageId }: { messageId: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    fetch(`/api/ocr/message/${messageId}/`)
      .then(res => {
        if (!res.ok) throw new Error('No extracted data found');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [messageId]);

  const handleExport = (fmt: string) => {
    window.open(`/api/ocr/message/${messageId}/export/${fmt}/`, '_blank');
  };

  // AI Q&A logic
  const suggestedQuestions = [
    'Give me a summary of this data.',
    'What are the key trends or insights?',
    'Are there any anomalies or outliers?'
  ];

  const askAI = (question: string) => {
    setAiLoading(true);
    setAiAnswer(null);
    fetch('/api/ocr/ai-agent/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, message_id: messageId })
    })
      .then(res => res.json())
      .then(res => setAiAnswer(res.answer || res.error || 'No answer'))
      .catch(e => setAiAnswer('Error: ' + e.message))
      .finally(() => setAiLoading(false));
  };

  if (loading) return <div className="text-cyan-400">Loading extracted data...</div>;
  // Do not show error if no extracted data found; just render nothing
  if (!data || (!data.extracted_data && !data.extracted_text)) return null;

  // Render preview: table if extracted_data is tabular, else JSON/text
  let preview = null;
  if (data.extracted_data && Array.isArray(data.extracted_data)) {
    const columns = Object.keys(data.extracted_data[0] || {});
    preview = (
      <div className="overflow-x-auto">
        <table className="min-w-[300px] border border-cyan-700 rounded-xl text-sm">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} className="px-3 py-2 bg-cyan-900 text-cyan-200 font-bold border-b border-cyan-700">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.extracted_data.map((row: any, i: number) => (
              <tr key={i} className="even:bg-cyan-950/40">
                {columns.map(col => (
                  <td key={col} className="px-3 py-2 border-b border-cyan-800">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (data.extracted_data) {
    preview = (
      <pre className="bg-gray-900 text-green-400 font-mono px-4 py-3 rounded-md shadow-inner border border-cyan/30 whitespace-pre-wrap overflow-x-auto text-xs mt-2">
        {JSON.stringify(data.extracted_data, null, 2)}
      </pre>
    );
  } else if (data.extracted_text) {
    preview = (
      <pre className="bg-gray-900 text-cyan-200 font-mono px-4 py-3 rounded-md shadow-inner border border-cyan/30 whitespace-pre-wrap overflow-x-auto text-xs mt-2">
        {data.extracted_text}
      </pre>
    );
  }

  return (
    <div className="bg-glass2 border border-cyan/20 rounded-xl p-4 mt-2 shadow-inner">
      <div className="text-cyan-300 font-semibold mb-2">Extracted Data Preview</div>
      {preview}
      <div className="flex gap-3 mt-4">
        <button onClick={() => handleExport('csv')} className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow">Export CSV</button>
        <button onClick={() => handleExport('xlsx')} className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs shadow">Export Excel</button>
        <button onClick={() => handleExport('json')} className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow">Export JSON</button>
      </div>
      {/* AI Q&A section */}
      <div className="mt-6">
        <div className="text-cyan-200 font-semibold mb-2">Ask DataWhiz AI about this data:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestedQuestions.map((q, i) => (
            <button key={i} onClick={() => askAI(q)} className="px-3 py-1 rounded-lg bg-cyan-800 hover:bg-cyan-900 text-white text-xs font-semibold shadow transition disabled:opacity-60" disabled={aiLoading}>{q}</button>
          ))}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (customQuestion.trim()) askAI(customQuestion.trim());
          }}
          className="flex gap-2 mt-2"
        >
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg bg-glass border border-cyan-700 text-cyan-100 text-sm focus:outline-none"
            placeholder="Ask a custom question about this data..."
            value={customQuestion}
            onChange={e => setCustomQuestion(e.target.value)}
            disabled={aiLoading}
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow" disabled={aiLoading || !customQuestion.trim()}>Ask</button>
        </form>
        {aiLoading && <div className="text-cyan-400 mt-2">Thinking...</div>}
        {aiAnswer && (
          <div className="mt-4 bg-gray-900/80 border border-cyan-700 rounded-xl p-4 text-cyan-100 text-sm whitespace-pre-line shadow-inner">
            <span className="font-bold text-cyan-300">AI Answer:</span>
            <div className="mt-2">{aiAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, onSendMessage }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && selectedFiles.length === 0) return;
    onSendMessage(input.trim(), selectedFiles);
    setInput('');
    setSelectedFiles([]);
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
                  {/* Data preview/edit/export UI placeholder (only for bot messages) */}
                  {msg.sender === 'bot' && (
                    <div className="mt-3">
                      <MessageActions messageId={msg.id} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSend} className="flex items-center p-4 border-t border-white/10 bg-glass2/80 relative z-10 gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-2xl bg-glass text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet border border-white/10 shadow-inner font-sans text-base"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <input
          type="file"
          multiple
          className="hidden"
          id="chat-file-input"
          onChange={e => {
            if (e.target.files) {
              setSelectedFiles(Array.from(e.target.files));
            }
          }}
        />
        <label htmlFor="chat-file-input" className="cursor-pointer px-3 py-2 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-500 text-white font-bold shadow-md hover:from-cyan-700 hover:to-purple-600 transition-all duration-200 border-none flex items-center gap-1">
          📎
        </label>
        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-1 ml-2">
            {selectedFiles.map((file, idx) => (
              <span key={idx} className="text-xs text-cyan-200 bg-glass px-2 py-1 rounded-lg truncate max-w-[120px]">{file.name}</span>
            ))}
          </div>
        )}
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