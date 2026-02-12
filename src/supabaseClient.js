// Mock Supabase client - no actual Supabase connection
// All data is stored locally in localStorage

const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error('Use pincode auth instead') }),
      signUp: async () => ({ data: null, error: new Error('Registration disabled') }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback) => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: (table) => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            single: async () => ({ data: null, error: null })
          }),
          limit: async () => ({ data: [], error: null })
        }),
        single: async () => ({ data: null, error: null })
      }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({
        eq: async () => ({ data: null, error: null })
      }),
      upsert: async () => ({ data: null, error: null }),
      delete: () => ({
        eq: async () => ({ error: null })
      })
    })
  };
};

export const supabase = createMockClient();

// Helper functions
export const getCurrentUser = async () => null;
export const isAuthenticated = async () => false;
export const signOut = async () => {};

export const auth = {
  signIn: async () => ({ data: null, error: new Error('Use pincode auth') }),
  signUp: async () => ({ data: null, error: new Error('Registration disabled') }),
  signOut,
  getSession: async () => null,
  getUser: getCurrentUser,
  isAuthenticated,
  onAuthStateChange: (callback) => ({ data: { subscription: { unsubscribe: () => {} } } })
};

console.log('Mock Supabase client initialized (local storage only)');
