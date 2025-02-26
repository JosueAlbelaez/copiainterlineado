import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const authUrl = env.VITE_BACKEND_URL || 'https://completointerlineadofluentphrases.vercel.app';
  const contentUrl = env.VITE_API_URL || 'https://interlineado-backend-fluent-phrases.vercel.app';

  return {
    plugins: [
      react({ jsxRuntime: 'automatic' })
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      port: 8080,
      proxy: {
        '/api/auth': { target: authUrl, changeOrigin: true, secure: false },
        '/api/payments': { target: authUrl, changeOrigin: true, secure: false },
        '/api': { target: contentUrl, changeOrigin: true, secure: false }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  };
});