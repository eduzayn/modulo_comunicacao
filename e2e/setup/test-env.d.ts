declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
    OPENAI_API_KEY: string
  }
}

declare module '@playwright/test' {
  interface TestFixtures {
    baseURL: string
  }
} 