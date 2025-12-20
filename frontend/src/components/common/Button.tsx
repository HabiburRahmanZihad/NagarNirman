'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    font-bold rounded-full transition-all duration-500 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-105 active:scale-95 transform
    focus:outline-none focus:ring-2 focus:ring-offset-2
    inline-flex items-center justify-center gap-3
    shadow-md hover:shadow-xl
    relative overflow-hidden
    before:absolute before:inset-0 before:transition-transform before:duration-500 before:ease-in-out
    before:translate-x-[-100%] hover:before:translate-x-0
  `;

  const variantStyles = {
    primary: `
      bg-primary text-white
      hover:shadow-2xl
      focus:ring-primary/50
      before:bg-accent
    `,
    secondary: `
      bg-white text-[#004d40]
      hover:bg-gray-50 hover:shadow-2xl
      focus:ring-gray-300/50
      active:bg-gray-100
      border-2 border-[#004d40]
    `,
    accent: `
      bg-accent text-white
      hover:shadow-2xl
      focus:ring-accent/50
      before:bg-primary
    `,
    outline: `
      border-2 border-white text-white bg-transparent
      hover:bg-white hover:text-[#004d40] hover:shadow-2xl
      focus:ring-white/50
      active:bg-gray-100 active:border-gray-100
    `,
    ghost: `
      bg-transparent text-primary
      hover:bg-primary/10 hover:text-[#67c173]
      focus:ring-primary/30
      active:bg-primary/20
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600 hover:shadow-2xl
      focus:ring-red-500/50
      active:bg-red-700
    `,
  };

  const sizeStyles = {
    sm: 'pl-4 pr-3 py-2 text-sm min-h-[36px]',
    md: 'pl-6 pr-4 py-2.5 text-base min-h-[44px]',
    lg: 'pl-8 pr-5 py-3.5 text-lg min-h-[52px]',
    xl: 'pl-10 pr-6 py-4 text-xl min-h-[60px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  // Default arrow icon if none provided
  const defaultIcon = (
    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 text-[#004d40]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 relative z-10" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="relative z-10">Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex relative z-10">{icon}</span>}
          <span className="flex-1 relative z-10">{children}</span>
          {iconPosition === 'right' && <span className="relative z-10">{icon || defaultIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
