import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600',
          'text-slate-100 placeholder-slate-500 transition-all duration-300',
          'focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-400/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-slate-400 text-sm mt-1">{helperText}</p>
      )}
    </div>
  )
}
