'use client'

import { clsx } from 'clsx'
import { useAssessmentStore } from '@/lib/stores/assessment-store'

interface ProgressBarProps {
  current: number
  total: number
  showLabel?: boolean
  labelText?: string
  variant?: 'default' | 'slim'
  showSteps?: boolean
}

export function ProgressBar({
  current,
  total,
  showLabel = false,
  labelText,
  variant = 'default',
  showSteps = true,
}: ProgressBarProps) {
  const { language } = useAssessmentStore()
  const isRTL = language === 'ar'
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      {showLabel && labelText && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-small text-neutral-600 dark:text-dark-text-muted">
            {labelText}
          </span>
          <span className="text-small font-medium text-neutral-700 dark:text-dark-text-secondary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={clsx(
        "relative bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden",
        variant === 'default' ? 'h-3' : 'h-2'
      )}>
        {/* Progress fill */}
        <div
          className={clsx(
            "absolute top-0 h-full bg-primary-600 dark:bg-primary-500",
            "transition-all duration-400 ease-out rounded-full",
            isRTL ? 'right-0' : 'left-0'
          )}
          style={{ 
            width: `${percentage}%`,
            '--from-width': '0%',
            '--to-width': `${percentage}%`
          } as React.CSSProperties}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Progress steps dots */}
        {showSteps && variant === 'default' && (
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: Math.min(total, 10) }, (_, index) => {
              const stepPosition = (index / (Math.min(total, 10) - 1)) * total
              const isPassed = stepPosition < current
              const isCurrent = Math.abs(stepPosition - current) < 0.5
              
              return (
                <div
                  key={index}
                  className={clsx(
                    "rounded-full transition-all duration-300",
                    isPassed || isCurrent
                      ? 'w-2 h-2 bg-white shadow-sm scale-110'
                      : 'w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600 scale-75'
                  )}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Question counter */}
      {variant === 'default' && (
        <div className="mt-3 text-center">
          <span className="text-body font-medium text-neutral-700 dark:text-dark-text-secondary">
            {current} / {total}
          </span>
        </div>
      )}
    </div>
  )
}