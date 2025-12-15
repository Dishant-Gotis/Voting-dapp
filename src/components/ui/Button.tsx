import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

/**
 * Button Component with Design System Variants
 * Based on frontend-ui.md specifications
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blockchain-blue text-text-primary hover:bg-blockchain-blue-light active:bg-blockchain-blue-dark shadow-md hover:shadow-lg hover:scale-105 focus-visible:ring-blockchain-blue-light',
        secondary: 'bg-bg-elevated border border-border-strong text-text-primary hover:bg-bg-surface hover:border-blockchain-blue-light focus-visible:ring-blockchain-blue-light',
        danger: 'bg-status-danger text-text-primary hover:bg-red-500 active:bg-red-700 shadow-md hover:shadow-lg hover:scale-105 focus-visible:ring-status-danger',
        gold: 'bg-gold text-text-inverse hover:bg-gold-light active:bg-gold-dark shadow-md hover:shadow-lg hover:scale-105 focus-visible:ring-gold',
        ghost: 'text-blockchain-blue hover:bg-blockchain-blue/10 hover:text-blockchain-blue-light focus-visible:ring-blockchain-blue-light',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-11 px-8 py-2 text-base',
        xl: 'h-12 px-8 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, disabled, loading, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
);

Button.displayName = 'Button';