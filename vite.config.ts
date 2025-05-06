import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    tsconfigPaths()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3000,
    // Standard development setup that matches Vercel deployment
    // API requests go directly to Vercel-compatible API routes in /api directory
    // For full simulation of the Vercel environment, use `vercel dev` instead
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Self-referential since API handlers are served by Vite
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          // Log proxy errors for easier debugging
          proxy.on('error', (err, req, res) => {
            console.error('API request error:', err);
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({
                status: 'error',
                error: 'API request failed',
                message: 'This could be due to API route not implemented in dev mode. ' +
                         'Consider using `vercel dev` for full API simulation.'
              }));
            }
          });
          return proxy;
        }
      },
    },
    fs: {
      allow: ['..']
    }
  },
});