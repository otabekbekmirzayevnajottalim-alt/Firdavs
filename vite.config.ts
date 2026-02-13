
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Netlify build vaqtida process.env.API_KEY ni kod ichiga joylashtiradi
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
