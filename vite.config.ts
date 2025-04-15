import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'api',
          dest: './'
        }
      ]
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': '/src' // Ensures path aliases work
    }
  },
  server: {
    port: 3000,
    // During development, proxy API requests to Vercel or a local API server
    proxy: {
      '/api': {
        target: process.env.VERCEL_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
    },
  },
});