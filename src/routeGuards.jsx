import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Loading fallback component
export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-live="polite">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4" aria-hidden="true" />
      <p className="text-gray-600 font-medium">Laden...</p>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};

/**
 * Public Route Component
 * Redirects to home if user is already authenticated
 */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};
