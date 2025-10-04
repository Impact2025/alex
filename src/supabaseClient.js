import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gdtqrpkoocyqoeikwumq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdHFycGtvb2N5cW9laWt3dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQzNTYsImV4cCI6MjA3NTA5MDM1Nn0.R8XnzTW2upcPiAEpkm3bHCM6ZjquOf-y87o7ZhWpe1M'

// Validate credentials
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('Supabase URL is not configured')
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('Supabase Anon Key is not configured')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
