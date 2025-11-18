import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  Icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', Icon, ...props }) => {
  const baseClasses = 'px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-content hover:bg-primary-focus',
    secondary: 'bg-secondary text-secondary-content hover:bg-secondary-focus',
    danger: 'bg-error text-white hover:bg-red-700',
    ghost: 'bg-transparent text-neutral hover:bg-base-300 shadow-none'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {Icon && <span className="w-7 h-7"><Icon/></span>}
      {children}
    </button>
  );
};

export default Button;