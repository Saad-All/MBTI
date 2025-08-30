'use client'

import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { Label, Text } from '@/components/ui/Typography'

interface BinaryChoiceProps {
  optionA: string
  optionB: string
  selectedOption?: 'A' | 'B' | null
  onSelect: (option: 'A' | 'B') => void
  disabled?: boolean
}

export function BinaryChoice({
  optionA,
  optionB,
  selectedOption,
  onSelect,
  disabled = false,
}: BinaryChoiceProps) {
  const { language } = useAssessmentStore()
  const isRTL = language === 'ar'

  return (
    <div className="space-y-4">
      {/* Option A */}
      <button
        onClick={() => onSelect('A')}
        disabled={disabled}
        className={`
          w-full p-4 md:p-6 rounded-xl border-2 transition-all duration-200
          touch-target no-select
          text-left rtl:text-right
          ${
            selectedOption === 'A'
              ? 'border-primary bg-primary/10 dark:bg-primary/20'
              : 'border-border-primary hover:border-border-secondary bg-surface-secondary hover:bg-surface-tertiary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          active:scale-[0.98] active:transition-transform
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          dark:focus:ring-offset-surface-primary
        `}
        aria-pressed={selectedOption === 'A'}
      >
        <div className="flex items-start gap-4 rtl:flex-row-reverse">
          <div
            className={`
              flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
              transition-all duration-200
              ${
                selectedOption === 'A'
                  ? 'border-primary bg-primary'
                  : 'border-border-secondary bg-surface-primary'
              }
            `}
          >
            {selectedOption === 'A' && (
              <svg
                className="w-4 h-4 text-white animate-scale-in"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <Label className="text-content-tertiary">
              {isRTL ? 'أ' : 'A'}
            </Label>
            <Text className="mt-1 text-content-primary">{optionA}</Text>
          </div>
        </div>
      </button>

      {/* Option B */}
      <button
        onClick={() => onSelect('B')}
        disabled={disabled}
        className={`
          w-full p-4 md:p-6 rounded-xl border-2 transition-all duration-200
          touch-target no-select
          text-left rtl:text-right
          ${
            selectedOption === 'B'
              ? 'border-primary bg-primary/10 dark:bg-primary/20'
              : 'border-border-primary hover:border-border-secondary bg-surface-secondary hover:bg-surface-tertiary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          active:scale-[0.98] active:transition-transform
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          dark:focus:ring-offset-surface-primary
        `}
        aria-pressed={selectedOption === 'B'}
      >
        <div className="flex items-start gap-4 rtl:flex-row-reverse">
          <div
            className={`
              flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
              transition-all duration-200
              ${
                selectedOption === 'B'
                  ? 'border-primary bg-primary'
                  : 'border-border-secondary bg-surface-primary'
              }
            `}
          >
            {selectedOption === 'B' && (
              <svg
                className="w-4 h-4 text-white animate-scale-in"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <Label className="text-content-tertiary">
              {isRTL ? 'ب' : 'B'}
            </Label>
            <Text className="mt-1 text-content-primary">{optionB}</Text>
          </div>
        </div>
      </button>
    </div>
  )
}