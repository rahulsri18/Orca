/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Operational Maritime Color System
        navy: {
          deep: '#071A2B',      // Command background & primary dark
          ocean: '#0B2942',     // Surfaces, headers, cards
          surface: '#0F3456',   // Raised borders and active elements
          muted: '#18476F',
        },
        marine: {
          blue: '#0D5C7A',      // Accents and secondary controls
          teal: '#0F8B8D',      // Primary interactive / selection
          cyan: '#2EAFD0',      // Highlight / telemetry
          light: '#EAF0F3',     // Secondary panel backgrounds
          border: '#D1DCE5',    // Standard thin UI borders
          bg: '#F4F7F8',        // Main application background
        },
        // Operational Risk Spectrum
        risk: {
          safe: '#1F9D72',
          safeLight: '#E8F6F1',
          caution: '#D89B24',
          cautionLight: '#FBF5E8',
          high: '#D96B3B',
          highLight: '#FCEFE9',
          critical: '#C93C4B',
          criticalLight: '#FBECEE',
        },
        // Legacy mapping for seamless compatibility
        ocean: {
          deep: '#071A2B',
          dark: '#051422',
          navy: '#0B2942',
          medium: '#0D5C7A',
          teal: '#0F8B8D',
          cyan: '#2EAFD0',
          light: '#EAF0F3',
          mist: '#F4F7F8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(7, 26, 43, 0.06), 0 1px 2px 0 rgba(7, 26, 43, 0.04)',
        'marine': '0 2px 8px 0 rgba(7, 26, 43, 0.08)',
        'panel': '0 4px 12px 0 rgba(7, 26, 43, 0.1)',
        'modal': '0 12px 32px 0 rgba(7, 26, 43, 0.25)',
      },
      borderRadius: {
        'panel': '8px',
        'card': '10px',
      }
    },
  },
  plugins: [],
}
