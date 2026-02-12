import React, { createContext, useContext, useState, useEffect } from 'react';
import { announceSuccess, announceError } from '../utils/announcer';

const AuthContext = createContext(null);

// Hardcoded users - Only Alex and Vincent
const USERS = {
  '2026': { id: 'alex', name: 'Alex', pincode: '2026' },
  '1977': { id: 'vincent', name: 'Vincent', pincode: '1977' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('ajax_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setSession({ user: userData });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signInWithPincode = async (pincode) => {
    try {
      setLoading(true);

      // Check if pincode matches Alex or Vincent
      const userData = USERS[pincode];

      if (!userData) {
        throw new Error('Ongeldige pincode');
      }

      // Create user object
      const user = {
        id: userData.id,
        email: `${userData.id}@ajax.nl`,
        user_metadata: { name: userData.name }
      };

      // Store in localStorage
      localStorage.setItem('ajax_user', JSON.stringify(user));

      setUser(user);
      setSession({ user });

      announceSuccess(`Welkom ${userData.name}!`);

      return { data: { user, session: { user } }, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      announceError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Keep old signIn for backwards compatibility but redirect to pincode
  const signIn = async (email, password) => {
    // If password is 4 digits, treat as pincode
    if (password && password.length === 4 && /^\d+$/.test(password)) {
      return signInWithPincode(password);
    }
    return { data: null, error: new Error('Gebruik alleen pincode login') };
  };

  const signUp = async (email, password) => {
    // Registration disabled
    return { data: null, error: new Error('Registratie is uitgeschakeld') };
  };

  const signOut = async () => {
    try {
      setLoading(true);

      localStorage.removeItem('ajax_user');
      setUser(null);
      setSession(null);

      announceSuccess('Uitgelogd');

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      announceError('Error signing out');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signInWithPincode,
    signUp,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
