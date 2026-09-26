import path from 'node:path'; // 👈 Додайте цей імпорт
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/openrouter': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, ''),
      },
    },
  },
});