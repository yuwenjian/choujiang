/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': {
          50: '#FFFDF7',
          100: '#FEF9E7',
          200: '#FCF3CF',
          300: '#F9E79F',
          400: '#F4D03F',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#996515',
          800: '#7A4F0F',
          900: '#5C3A0A',
        },
        'royal': {
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#533483',
          400: '#e94560',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Source Sans Pro', 'Microsoft YaHei', 'PingFang SC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.4)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37, #F4C430, #FFD700, #F4C430, #D4AF37)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212, 175, 55, 0.5)',
        'gold-lg': '0 0 50px rgba(212, 175, 55, 0.6), 0 0 100px rgba(212, 175, 55, 0.3)',
        'inner-gold': 'inset 0 0 30px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
}
