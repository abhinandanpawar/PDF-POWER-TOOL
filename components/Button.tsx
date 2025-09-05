import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-secondary text-black hover:bg-secondary-hover focus:ring-secondary',
    danger: 'bg-danger text-white hover:bg-danger-hover focus:ring-danger',
    ghost: 'bg-transparent text-text-primary hover:bg-gray-200 focus:ring-primary',
  };

  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
