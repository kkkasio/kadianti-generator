import { defineConfig } from 'vite'
import path from "path";

export default defineConfig({
  root: '.',
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'state-vendor': ['zustand'],
        },
      },
    },
  }
})