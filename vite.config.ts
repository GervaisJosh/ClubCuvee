import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// Plugin to handle API routes in development
function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server: any) {
      server.middlewares.use('/api', async (req: any, res: any, next: any) => {
        console.log(`🔄 API Request: ${req.method} ${req.url}`);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }
        
        // For development, provide helpful error message
        res.writeHead(501, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'API routes not available in Vite dev mode',
          message: 'To use API routes, install Vercel CLI and run: vercel dev',
          instructions: [
            '1. npm install -g vercel',
            '2. vercel dev (instead of npm run dev)',
            '3. Follow prompts to link your project'
          ]
        }));
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    // Removed viteStaticCopy to prevent API folder conflicts with Vercel
    tsconfigPaths(),
    apiDevPlugin()
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
      '@/lib': path.resolve(__dirname, './lib'),
      '@/api': path.resolve(__dirname, './api'),
      '@/src': path.resolve(__dirname, './src')
    },
  },
  server: {
    port: 3000,
    fs: {
      allow: ['..']
    }
  },
});