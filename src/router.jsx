import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Eager load only critical components
import LoginScreen from './LoginScreen';
import { ProtectedRoute, PublicRoute } from './routeGuards';

// Lazy load everything else for code splitting
const App = lazy(() => import('./App'));

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
