import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  elevated?: boolean
}

export const Card: React.FC<CardProps> = ({ children, elevated = false, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-slate-900 border border-slate-700 rounded-lg p-6 transition-all duration-300',
        elevated && 'shadow-[0_4px_12px_rgba(0,0,0,0.4)]',
        'hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
