module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#1C2333',
          800: '#2D3542',
          700: '#3E4654',
          600: '#4F5766',
          500: '#606E7A',
        }
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'blockchain-glow': 'blockchainGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
