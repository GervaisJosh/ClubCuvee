import { build } from 'esbuild';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildApi() {
  try {
    // Find all TypeScript files in the api directory
    const entryPoints = await glob('api/**/*.ts', {
      ignore: ['api/**/*.test.ts', 'api/**/*.d.ts']
    });

    // Build each API route
    await build({
      entryPoints,
      bundle: true,
      outdir: 'api',
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      sourcemap: true,
      external: [
        '@vercel/node',
        '@supabase/supabase-js',
        'stripe',
        'crypto',
        'stream',
        'http',
        'https',
        'url',
        'zod'
      ],
      outbase: 'api',
      loader: { '.ts': 'ts' },
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      banner: {
        js: '// @ts-nocheck\n'
      },
      alias: {
        '@': resolve(__dirname, '..'),
        '@/lib': resolve(__dirname, '../lib'),
        '@/api': resolve(__dirname, '../api'),
        '@/src': resolve(__dirname, '../src')
      },
      // Ensure proper bundling for Vercel
      metafile: true,
      inject: [],
      // Ensure proper path resolution
      absWorkingDir: resolve(__dirname, '..')
    });

    console.log('✅ API build complete');
    console.log(`📦 Built ${entryPoints.length} API routes`);
  } catch (error) {
    console.error('❌ API build failed:', error);
    process.exit(1);
  }
}

buildApi(); 