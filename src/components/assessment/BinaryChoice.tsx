'use client'

import { useAssessmentStore } from '@/lib/stores/assessment-store'

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
          w-full p-4 md:p-6 text-left rounded-xl border-2 transition-all
          touch-target no-select
          ${isRTL ? 'text-right' : 'text-left'}
          ${
            selectedOption === 'A'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 hover:dark:border-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          active:scale-[0.98] active:transition-transform
        `}
      >
        <div className="flex items-start gap-4">
          <div
            className={`
              flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${
                selectedOption === 'A'
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300 dark:border-gray-600'
              }
            `}
          >
            {selectedOption === 'A' && (
              <svg
                className="w-4 h-4 text-white"
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
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {isRTL ? 'أ' : 'A'}
            </span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{optionA}</p>
          </div>
        </div>
      </button>

      {/* Option B */}
      <button
        onClick={() => onSelect('B')}
        disabled={disabled}
        className={`
          w-full p-4 md:p-6 text-left rounded-xl border-2 transition-all
          touch-target no-select
          ${isRTL ? 'text-right' : 'text-left'}
          ${
            selectedOption === 'B'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 hover:dark:border-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          active:scale-[0.98] active:transition-transform
        `}
      >
        <div className="flex items-start gap-4">
          <div
            className={`
              flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${
                selectedOption === 'B'
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300 dark:border-gray-600'
              }
            `}
          >
            {selectedOption === 'B' && (
              <svg
                className="w-4 h-4 text-white"
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
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {isRTL ? 'ب' : 'B'}
            </span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{optionB}</p>
          </div>
        </div>
      </button>
    </div>
  )
}