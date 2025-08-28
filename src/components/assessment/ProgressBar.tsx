'use client'

import { useAssessmentStore } from '@/lib/stores/assessment-store'

interface ProgressBarProps {
  current: number
  total: number
  showLabel?: boolean
  labelText?: string
}

export function ProgressBar({
  current,
  total,
  showLabel = false,
  labelText,
}: ProgressBarProps) {
  const { language } = useAssessmentStore()
  const isRTL = language === 'ar'
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      {showLabel && labelText && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {labelText}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Background progress track */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
        
        {/* Progress fill */}
        <div
          className={`
            absolute top-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 
            transition-all duration-500 ease-out rounded-full
            ${isRTL ? 'right-0' : 'left-0'}
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Progress steps dots */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {Array.from({ length: total }, (_, index) => {
            const isPassed = index < current
            const isCurrent = index === current - 1
            
            return (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${
                    isPassed || isCurrent
                      ? 'bg-white shadow-sm scale-110'
                      : 'bg-gray-300 dark:bg-gray-600 scale-75'
                  }
                `}
              />
            )
          })}
        </div>
      </div>

      {/* Question counter */}
      <div className="mt-3 text-center">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">
          {current} / {total}
        </span>
      </div>
    </div>
  )
}