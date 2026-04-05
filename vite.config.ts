import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Determine base URL: configurable via BASE_URL env var, defaulting to /Finance-Pro.2/ for GitHub Pages
const base =
  typeof process !== 'undefined' && process.env && process.env['BASE_URL']
    ? process.env['BASE_URL']
    : '/Finance-Pro.2/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@/types': resolve(__dirname, 'src/types'),
      '@/constants': resolve(__dirname, 'src/constants'),
      '@/contexts': resolve(__dirname, 'src/contexts'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/services': resolve(__dirname, 'src/services'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/app': resolve(__dirname, 'src/app'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
