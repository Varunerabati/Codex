import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white shadow-sm dark:bg-slate-800',
      bordered: 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700',
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl transition-all ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
