import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local')
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage for persistence
    storage: window.localStorage,
    // Auto refresh tokens before they expire
    autoRefreshToken: true,
    // Persist session across page reloads
    persistSession: true,
    // Detect session from URL on OAuth callbacks
    detectSessionInUrl: true,
    // Flow type for authentication
    flowType: 'pkce'
  },
  // Global settings
  global: {
    headers: {
      'X-Client-Info': 'ajax-performance-suite@1.0.0'
    }
  },
  // Database settings
  db: {
    schema: 'public'
  },
  // Realtime settings (can be enabled if needed)
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Export auth helpers for easy access
export const auth = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },

  signOut,

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  getUser: getCurrentUser,

  isAuthenticated,

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

console.log('Supabase client initialized with URL:', supabaseUrl)
