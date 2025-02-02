import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils")
    },
  },
  server: {
    port: 8080,
    proxy: {
      "/api/auth": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "https://interlineado-backend-fluent-phrases.vercel.app",
        changeOrigin: true,
        secure: false,
      }
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});