import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        success: 'bg-accent-green/10 text-accent-green border border-accent-green/20',
        error: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        warning: 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20',
        info: 'bg-primary/10 text-primary border border-primary/20',
        default: 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  text?: string;
  children?: React.ReactNode;
}

export function Badge({ 
  className, 
  variant, 
  size, 
  text, 
  children, 
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {text || children}
    </div>
  );
}

// Specific status badges for blockchain voting
export function ElectionStatusBadge({ status }: { status: 'upcoming' | 'active' | 'ended' }) {
  const variants = {
    upcoming: 'info',
    active: 'success',
    ended: 'default',
  } as const;

  const labels = {
    upcoming: 'Upcoming',
    active: 'Active',
    ended: 'Ended',
  };

  return (
    <Badge variant={variants[status]} text={labels[status]} />
  );
}

export function TransactionStatusBadge({ status }: { status: 'pending' | 'confirmed' | 'failed' }) {
  const variants = {
    pending: 'warning',
    confirmed: 'success',
    failed: 'error',
  } as const;

  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    failed: 'Failed',
  };

  return (
    <Badge variant={variants[status]} text={labels[status]} />
  );
}

export function NetworkBadge({ networkName, isCorrect }: { networkName: string; isCorrect: boolean }) {
  return (
    <Badge 
      variant={isCorrect ? 'success' : 'warning'} 
      text={networkName}
    />
  );
}