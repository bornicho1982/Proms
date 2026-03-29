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
  const baseClass = 'card-premium';
  const paddingClass = `p-${padding}`;
  
  return (
    <div className={`${baseClass} card-${variant} ${paddingClass} ${className}`} {...props}>
      <div className="card-ambient-glow" />
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export const Badge = ({ 
  children, 
  variant = 'primary',
  className = '',
  ...props
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'; 
  className?: string; 
  style?: React.CSSProperties;
}) => {
  const baseClass = 'badge-premium';
  const variantClass = `badge-${variant}`;
  
  return (
    <span className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};
