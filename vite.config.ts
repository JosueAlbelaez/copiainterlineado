import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const authUrl = env.VITE_BACKEND_URL || 'http://localhost:5001';

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
        '/api/auth': {
          target: authUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        },
        '/api/payments': {
          target: authUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
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