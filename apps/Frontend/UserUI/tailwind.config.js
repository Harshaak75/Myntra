// // tailwind.config.js

// // import { defineConfig } from 'tailwindcss'

export default {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
            gradientBlueStart: '#93a2ff',
            gradientBlueEnd: '#e4e9ff',
            gradientPinkStart: '#ffa8d8',
            gradientPinkEnd: '#fde4f1',
          },
          backgroundImage: {
            'blue-gradient': 'linear-gradient(to right, #93a2ff, #e4e9ff)',
            'pink-gradient': 'linear-gradient(to left, #ffa8d8, #fde4f1)',
          },
      },
    },
    plugins: [
      require('tailwind-scrollbar-hide')  // 👈 add this line
    ],
  };
  