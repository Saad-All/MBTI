import { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-surface-tertiary dark:bg-surface-secondary'
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  }
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  }
  
  const defaultDimensions = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '40px', height: '40px' },
    rectangular: { width: '100%', height: '120px' },
    rounded: { width: '100%', height: '120px' }
  }
  
  const dimensions = {
    width: width || defaultDimensions[variant].width,
    height: height || defaultDimensions[variant].height
  }

  return (
    <div
      className={`
        ${baseClasses}
        ${animationClasses[animation]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        ...style
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-secondary dark:bg-surface-tertiary rounded-xl p-6 space-y-4">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  )
}