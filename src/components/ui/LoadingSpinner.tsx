import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
      },
      color: {
        primary: 'text-primary',
        secondary: 'text-secondary',
        white: 'text-white',
        current: 'text-current'
      }
    },
    defaultVariants: {
      size: 'md',
      color: 'primary'
    }
  }
)

export interface LoadingSpinnerProps 
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

export function LoadingSpinner({ 
  size, 
  color, 
  label = 'Loading',
  className = '',
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div 
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <svg
        className={spinnerVariants({ size, color })}
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
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function LoadingOverlay({ 
  message = 'Loading...', 
  fullScreen = false 
}: { 
  message?: string
  fullScreen?: boolean 
}) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 rounded-lg'

  return (
    <div className={`
      ${containerClasses}
      flex items-center justify-center
      bg-surface-primary/80 backdrop-blur-sm
    `}>
      <div className="flex flex-col items-center gap-4 p-6 bg-surface-secondary rounded-xl shadow-lg">
        <LoadingSpinner size="lg" />
        <p className="text-content-secondary font-medium">{message}</p>
      </div>
    </div>
  )
}