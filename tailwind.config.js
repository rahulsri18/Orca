/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#0B3D5C',
          dark: '#07273C',
          navy: '#0F4D71',
          medium: '#1C7293',
          teal: '#2E9CBF',
          cyan: '#38BDF8',
          light: '#EBF4F6',
          mist: '#F0F7FA',
        },
        marine: {
          safe: '#2E8B57',
          safeLight: '#E8F5E9',
          warning: '#E67E22',
          warningLight: '#FEF3E2',
          danger: '#C0392B',
          dangerLight: '#FDECEA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'marine': '0 4px 20px -2px rgba(11, 61, 92, 0.12)',
        'glow-cyan': '0 0 20px -3px rgba(56, 189, 248, 0.45)',
        'glow-safe': '0 0 20px -3px rgba(46, 139, 87, 0.45)',
        'glow-danger': '0 0 20px -3px rgba(192, 57, 43, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [],
}
