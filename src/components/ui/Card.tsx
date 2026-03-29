import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  children, 
  className = '', 
  variant = 'glass',
  padding = 'md',
  ...props
}: CardProps) => {
  const baseClass = 'glass-card';
  const paddingClass = `p-${padding}`; // Custom paddings or handle with inline style
  
  return (
    <div className={`${baseClass} card-${variant} ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  className = '',
  ...props
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'accent' | 'danger' | 'warning';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={`badge-base badge-${variant} size-${size} ${className}`} {...props}>
      {children}
    </span>
  );
};
