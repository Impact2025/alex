import { createClient } from '@supabase/supabase-js'

// Fallback Supabase credentials (hardcoded for reliability)
const FALLBACK_URL = 'https://gdtqrpkoocyqoeikwumq.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdHFycGtvb2N5cW9laWt3dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQzNTYsImV4cCI6MjA3NTA5MDM1Nn0.R8XnzTW2upcPiAEpkm3bHCM6ZjquOf-y87o7ZhWpe1M'

// Get credentials from env or use fallback
const getSupabaseUrl = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL
  if (envUrl && envUrl !== 'undefined' && envUrl !== 'null' && envUrl.startsWith('http')) {
    return envUrl
  }
  return FALLBACK_URL
}

const getSupabaseKey = () => {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (envKey && envKey !== 'undefined' && envKey !== 'null' && envKey.length > 20) {
    return envKey
  }
  return FALLBACK_KEY
}

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseKey()

console.log('Supabase URL:', supabaseUrl)
console.log('Using fallback credentials:', supabaseUrl === FALLBACK_URL)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
