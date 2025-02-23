import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:5001';

  return {
    plugins: [react({
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
        '/api/readings': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/api/phrases': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/api/auth': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      target: 'esnext'
    }
  };
});