import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Eager load only critical components
import LoginScreen from './LoginScreen';

// Lazy load everything else for code splitting
const App = lazy(() => import('./App'));
const PointsDashboard = lazy(() => import('./components/PointsDashboard'));
const Journal = lazy(() => import('./components/Journal'));
const MatchDay = lazy(() => import('./components/MatchDay'));

// Loading fallback component
const LoadingFallback = () => (
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
const ProtectedRoute = ({ children }) => {
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
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};

/**
 * Router Configuration
 * Defines all application routes with proper protection
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginScreen />
      </PublicRoute>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;
