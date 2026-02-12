import React from 'react';

/**
 * Accessible Input Component
 * Supports validation, icons, different types
 */
const Input = ({
  id,
  type = 'text',
  value,
  onChange,
  label,
  placeholder = '',
  disabled = false,
  required = false,
  error = '',
  icon: Icon,
  className = '',
  autoComplete,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const hasError = !!error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-gray-700 font-semibold mb-2"
        >
          {label}
          {required && <span className="text-red-600 ml-1" aria-label="verplicht">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={20} aria-hidden="true" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full py-3 px-4 ${Icon ? 'pl-10' : ''}
            border-2 rounded-lg
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}
            text-gray-900
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          aria-required={required}
          {...props}
        />
      </div>

      {hasError && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
