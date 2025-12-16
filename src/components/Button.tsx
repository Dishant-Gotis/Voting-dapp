import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'font-semibold transition-all duration-300 rounded-lg flex items-center justify-center gap-2'

  const variantClasses = {
    primary: 'bg-blue-700 text-white border border-yellow-400 hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] active:bg-blue-800',
    secondary: 'bg-slate-700 text-white border border-slate-500 hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  }

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="animate-spin-slow">⏳</span>}
      {icon && !isLoading && icon}
      {children}
    </button>
  )
}
