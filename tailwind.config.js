/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', '"Space Grotesk"', '"Sora"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        violet: '#8B5CF6',
        cyan: '#22D3EE',
        purple: '#9333EA',
        glass: 'rgba(30,30,47,0.6)',
        glass2: 'rgba(26,26,46,0.6)',
      },
      boxShadow: {
        neon: '0 0 10px #9333EA',
        'neon-cyan': '0 0 10px #22D3EE',
        'neon-violet': '0 0 10px #8B5CF6',
        'neon-purple': '0 0 10px #9333EA',
      },
      backgroundImage: {
        'futuristic-gradient': 'radial-gradient(ellipse at 80% 20%, #9333EA 0%, #1e1e2f 100%)',
      },
    },
  },
  plugins: [],
}; 