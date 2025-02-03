// src/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_PINECONE_API_KEY: string;
      CRON_SECRET: string;
    }
  }