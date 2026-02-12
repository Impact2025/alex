import React from 'react';

/**
 * Loading Component
 * Accessible loading indicator with proper ARIA attributes
 */
const Loading = ({ message = 'Laden...', fullScreen = false }) => {
  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="text-gray-600 font-medium">{message}</p>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
