import React from 'react';

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg transition cursor-pointer bg-transparent border-0 p-0"
      tabIndex={0}
      aria-label="Go to main page"
    >
      {/* Modern, glassy, neon-accented DW logo with spark accent */}
      <span className="inline-block">
        <span className="relative block">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="dw-glass-bg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
              </radialGradient>
              <linearGradient id="dw-neon" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#a21caf" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Glassy circular background */}
            <circle cx="22" cy="22" r="20" fill="url(#dw-glass-bg)" filter="url(#glow)" />
            {/* Neon DW monogram */}
            <text x="50%" y="56%" textAnchor="middle" fontFamily="'Inter', 'Segoe UI', Arial, sans-serif" fontWeight="bold" fontSize="18" fill="url(#dw-neon)" filter="url(#glow)" letterSpacing="2">DW</text>
            {/* Spark/star accent */}
            <g filter="url(#glow)">
              <polygon points="36,10 38,14 42,15 38,16 36,20 34,16 30,15 34,14" fill="#f472b6" opacity="0.85" />
            </g>
          </svg>
        </span>
      </span>
      <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-sans uppercase drop-shadow-md">DataWhiz</span>
    </button>
  );
} 