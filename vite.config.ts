import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),  // Alias extra opcional
      "@utils": path.resolve(__dirname, "src/utils")   // Alias extra opcional
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001", // Dirección de tu backend
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
