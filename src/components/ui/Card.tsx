import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

/**
 * Card Component with Design System Colors
 * Based on frontend-ui.md specifications
 * Dark theme: bg-bg-surface (#1A1F3A) with border-subtle borders
 */

const cardVariants = cva(
  'rounded-lg border bg-bg-surface border-border-subtle transition-all',
  {
    variants: {
      elevation: {
        sm: 'shadow-sm',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
      },
      hoverable: {
        true: 'hover:border-border-strong cursor-pointer transform hover:scale-105 transition-transform',
        false: '',
      },
    },
    defaultVariants: {
      elevation: 'md',
      hoverable: false,
    },
  }
);

type CardVariants = VariantProps<typeof cardVariants>;

interface CardDivProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  elevation?: CardVariants['elevation'];
  hoverable?: CardVariants['hoverable'];
  title?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  title,
  children,
  footer,
  elevation,
  hoverable,
  className,
  ...props
}: CardDivProps) {
  return (
    <div
      className={cn(cardVariants({ elevation, hoverable, className }))}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-border-subtle">
          <h3 className="text-xl font-semibold text-text-primary">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6 text-text-secondary">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border-subtle bg-bg-elevated rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-border-subtle', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 text-text-secondary', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-border-subtle bg-bg-elevated rounded-b-lg', className)}>
      {children}
    </div>
  );
}