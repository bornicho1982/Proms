'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'modern' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseClass = 'btn-premium';
  const variantClass = `variant-${variant}`;
  const sizeClass = `size-${size}`;
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      <div className="btn-inner">
        {isLoading ? (
          <span className="loading-spinner" />
        ) : children}
      </div>
    </button>
  );
};
