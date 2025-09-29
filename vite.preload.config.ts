import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: 'src/preload.ts',
      fileName: () => "preload.js",
      name: 'preload'
    },
    outDir: ".vite/build",
    rollupOptions: {
      external: ["electron"],
    },
  }
});
