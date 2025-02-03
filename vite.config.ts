import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
});