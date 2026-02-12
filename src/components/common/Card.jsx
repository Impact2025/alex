import React from 'react';

/**
 * Card Component
 * Reusable container with consistent styling
 */
const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  onClick,
  className = '',
  padding = 'normal',
  hoverable = false,
  ...props
}) => {
  const isClickable = !!onClick;

  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const baseStyles = 'bg-white rounded-2xl shadow-md';
  const hoverStyles = hoverable || isClickable ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  const clickableStyles = isClickable ? 'focus:outline-none focus:ring-2 focus:ring-red-500' : '';

  const Component = isClickable ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      {...(isClickable && {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        }
      })}
      {...props}
    >
      {/* Header */}
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="flex-shrink-0">
              <Icon size={24} className="text-red-600" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {children}
    </Component>
  );
};

export default Card;
