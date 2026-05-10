/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#050a15',
          darker: '#02050a',
          light: '#1e293b',
          blue: '#00f0ff',
          purple: '#b026ff',
          red: '#ff003c',
          green: '#00ff66',
          warning: '#ffb800'
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(145deg, #02050a 0%, #050a15 100%)',
        'glow-blue': 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, rgba(0,0,0,0) 70%)',
        'glow-purple': 'radial-gradient(circle, rgba(176,38,255,0.15) 0%, rgba(0,0,0,0) 70%)',
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0,240,255,0.5), 0 0 20px rgba(0,240,255,0.3)',
        'neon-purple': '0 0 10px rgba(176,38,255,0.5), 0 0 20px rgba(176,38,255,0.3)',
        'neon-red': '0 0 10px rgba(255,0,60,0.5), 0 0 20px rgba(255,0,60,0.3)',
        'neon-green': '0 0 10px rgba(0,255,102,0.5), 0 0 20px rgba(0,255,102,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
