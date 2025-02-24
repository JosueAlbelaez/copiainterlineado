import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carga variables de entorno desde .env
  const env = loadEnv(mode, process.cwd(), '')

  // Usa la URL de backend para autenticación, con fallback a producción o local
  const authUrl = env.VITE_BACKEND_URL || 'https://completointerlineadofluentphrases.vercel.app'
  // Usa la URL de backend para contenido, con fallback a producción o local
  const contentUrl = env.VITE_API_URL || 'https://interlineado-backend-fluent-phrases.vercel.app'

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic'
      })
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      port: 8080, // Cambia si necesitas otro puerto
      proxy: {
        // Proxy para endpoints de autenticación
        '/api/auth': {
          target: authUrl,
          changeOrigin: true,
          secure: false
        },
        // Proxy para endpoints de pagos (si los usas)
        '/api/payments': {
          target: authUrl,
          changeOrigin: true,
          secure: false
        },
        // Proxy para otros endpoints de la API (ej. /api/phrases)
        '/api': {
          target: contentUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            // Ejemplo: separar dependencias grandes en un chunk aparte
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  }
})
