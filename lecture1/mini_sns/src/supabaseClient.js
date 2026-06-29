import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vqrollmvvwfvtyyboywy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxcm9sbG12dndmdnR5eWJveXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjUyMDMsImV4cCI6MjA5NzcwMTIwM30.-VFqORZNRQ6zwg_BCxNXOV9fzmmlsBV2zgqfcyWtgrw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
