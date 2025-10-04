import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase credentials for production reliability
const supabaseUrl = 'https://gdtqrpkoocyqoeikwumq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdHFycGtvb2N5cW9laWt3dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQzNTYsImV4cCI6MjA3NTA5MDM1Nn0.R8XnzTW2upcPiAEpkm3bHCM6ZjquOf-y87o7ZhWpe1M'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key length:', supabaseAnonKey.length)

// Validate that we have valid credentials
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Invalid Supabase URL:', supabaseUrl)
  throw new Error('Invalid Supabase URL configuration')
}

if (!supabaseAnonKey || supabaseAnonKey.length < 20) {
  console.error('Invalid Supabase Key')
  throw new Error('Invalid Supabase Key configuration')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
