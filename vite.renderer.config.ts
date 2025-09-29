const { defineConfig } = require('vite');

// https://vitejs.dev/config
module.exports = defineConfig(async () => {
  const react = await import('@vitejs/plugin-react');
  const tailwindcss = await import('@tailwindcss/vite');

  return {
    plugins: [react.default(), tailwindcss.default()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'state-vendor': ['zustand'],
          },
        },
      },
    },
  };
});
