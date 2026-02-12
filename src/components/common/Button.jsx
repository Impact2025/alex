import React from 'react';

/**
 * Accessible Button Component
 * Supports variants, sizes, icons, and full accessibility
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-full transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'text-red-600 hover:bg-red-50 disabled:text-gray-400',
    danger: 'bg-red-700 text-white hover:bg-red-800 disabled:bg-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" aria-hidden="true" />
          <span>Laden...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={20} aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={20} aria-hidden="true" />}
        </>
      )}
    </button>
  );
};

export default Button;
