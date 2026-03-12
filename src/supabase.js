import { createClient } from '@supabase/supabase-js'

// import.meta.env reads from your .env file (Vite-specific syntax).
// The VITE_ prefix is required — Vite only exposes variables with that prefix.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
