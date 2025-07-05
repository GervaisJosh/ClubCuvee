// src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Client-side environment variables
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_PINECONE_API_KEY: string;
    VITE_STRIPE_PUBLIC_KEY: string;
    VITE_OPENAI_API_KEY: string;
    
    // Server-side environment variables
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET?: string;
    CRON_SECRET: string;
  }
}

// Add Vite's import.meta.env type definitions
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PINECONE_API_KEY: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}