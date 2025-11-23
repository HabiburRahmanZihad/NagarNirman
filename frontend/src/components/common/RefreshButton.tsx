'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { FaSync } from 'react-icons/fa';

interface RefreshButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick: () => void | Promise<void>;
  isRefreshing?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  iconOnly?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  isRefreshing = false,
  variant = 'outline',
  size = 'md',
  showLabel = true,
  label = 'Refresh',
  iconOnly = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center';

  const variantStyles = {
    primary: 'bg-[#2a7d2f] text-white hover:bg-[#1e5d22]',
    secondary: 'bg-[#81d586] text-white hover:bg-[#67c173]',
    outline: 'border-2 border-[#2a7d2f] text-[#2a7d2f] hover:bg-[#2a7d2f] hover:text-white bg-white',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  const sizeStyles = {
    sm: iconOnly ? 'p-2' : 'px-3 py-1.5 text-sm',
    md: iconOnly ? 'p-2.5' : 'px-4 py-2 text-base',
    lg: iconOnly ? 'p-3' : 'px-6 py-2.5 text-lg',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isRefreshing}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <FaSync className={`${iconSizes[size]} ${isRefreshing ? 'animate-spin' : ''}`} />
      {!iconOnly && showLabel && <span>{label}</span>}
    </button>
  );
};

export default RefreshButton;
