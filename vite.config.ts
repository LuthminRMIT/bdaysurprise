import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    // Use @vitejs/plugin-react instead of @vitejs/plugin-react-swc to avoid native binding issues
    react({
      jsxRuntime: 'automatic'
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Add these for better Vercel compatibility
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu'],
  },
  // Ensure compatibility with Vercel's Node.js environment
  esbuild: {
    target: 'node18'
  }
}));