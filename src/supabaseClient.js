import { createClient } from '@supabase/supabase-js'

// Deze waarden krijg je van je Supabase dashboard
// 1. Ga naar https://supabase.com/dashboard
// 2. Maak een nieuw project aan
// 3. Kopieer je Project URL en anon/public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
