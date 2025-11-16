import { type ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'default' | 'large';
  className?: string;
}

export function Link({ href, children, variant = 'primary', size = 'default', className = '' }: LinkProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    default: 'px-5 py-2.5 text-sm',
    large: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 focus:ring-teal-500',
    white: 'bg-white text-teal-600 hover:bg-gray-50 focus:ring-teal-500 shadow-sm',
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
