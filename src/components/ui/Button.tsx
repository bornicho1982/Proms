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
  const baseClass = 'btn-base';
  const variantClass = `btn-${variant}-modern`; // Map to existing classes or create new ones
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${size} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="loading-spinner" style={{ width: '16px', height: '16px' }} />
      ) : children}
    </button>
  );
};
