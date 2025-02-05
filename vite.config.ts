
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    // Habilitar JSX en archivos .tsx
    jsxRuntime: 'automatic'
  })],
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
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth')
      },
      '/api': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
