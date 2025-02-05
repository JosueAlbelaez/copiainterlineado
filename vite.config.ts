import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
          secure: false
        },
        '/api/create-preference': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false
        },
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});