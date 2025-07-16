"use client";
import { useEffect, useState } from 'react';
import { Sun, Moon, GlassWater } from 'lucide-react';

const themes = [
  { name: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark' },
  { name: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light' },
  { name: 'glass', icon: <GlassWater className="w-5 h-5" />, label: 'Glass' },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // On mount, check localStorage or system preference
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    else setTheme('light');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const html = document.documentElement;
    html.classList.remove('dark', 'light', 'glass');
    html.classList.add(theme);
  }, [theme]);

  return (
    <div className="flex gap-2 items-center">
      {themes.map(t => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`p-2 rounded-full border-2 border-white/10 bg-gradient-to-br from-glass to-glass2 shadow-lg hover:shadow-[0_0_10px_#8B5CF6] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-glass transition-all duration-200
            ${theme === t.name ? 'ring-2 ring-violet text-violet bg-violet/20' : 'text-gray-300 hover:text-cyan'}`}
          aria-label={`Switch to ${t.label} theme`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
} 