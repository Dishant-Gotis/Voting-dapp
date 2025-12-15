import React from 'react';
import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  overlay?: boolean;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'text-primary', 
  overlay = false,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const spinner = (
    <div className={cn('animate-spin', sizeClasses[size], color, className)}>
      <svg
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
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

// Blockchain-themed loading animation
export function BlockchainLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-primary rounded-sm animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
}

// Transaction processing animation
export function TransactionLoader({ message = 'Processing transaction...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {message}
      </p>
    </div>
  );
}

// Network connection animation
export function NetworkLoader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1 h-4 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Connecting to network...
      </span>
    </div>
  );
}