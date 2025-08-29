'use client'

import { useState, useEffect } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { useTranslation } from 'react-i18next'

interface SAISDistributionProps {
  optionA: string
  optionB: string
  optionATendency: string
  optionBTendency: string
  initialDistribution?: { pointsA: number; pointsB: number }
  onDistribute: (pointsA: number, pointsB: number) => void
  disabled?: boolean
}

export function SAISDistribution({
  optionA,
  optionB,
  optionATendency,
  optionBTendency,
  initialDistribution = { pointsA: 2, pointsB: 3 },
  onDistribute,
  disabled = false,
}: SAISDistributionProps) {
  const { language } = useAssessmentStore()
  const { t } = useTranslation('common')
  const isRTL = language === 'ar'
  
  const [pointsA, setPointsA] = useState(initialDistribution.pointsA)
  const [pointsB, setPointsB] = useState(initialDistribution.pointsB)
  
  const totalPoints = 5
  
  useEffect(() => {
    setPointsA(initialDistribution.pointsA)
    setPointsB(initialDistribution.pointsB)
  }, [initialDistribution])
  
  const handleSliderChange = (value: number[]) => {
    const newPointsA = value[0]
    const newPointsB = totalPoints - newPointsA
    
    setPointsA(newPointsA)
    setPointsB(newPointsB)
    
    onDistribute(newPointsA, newPointsB)
  }
  
  const handlePointButtonClick = (pointsForA: number) => {
    const newPointsA = pointsForA
    const newPointsB = totalPoints - pointsForA
    
    setPointsA(newPointsA)
    setPointsB(newPointsB)
    
    onDistribute(newPointsA, newPointsB)
  }
  
  const distributionOptions = [
    { a: 5, b: 0, labelA: '5-0', labelB: '0-5' },
    { a: 4, b: 1, labelA: '4-1', labelB: '1-4' },
    { a: 3, b: 2, labelA: '3-2', labelB: '2-3' },
    { a: 2, b: 3, labelA: '2-3', labelB: '3-2' },
    { a: 1, b: 4, labelA: '1-4', labelB: '4-1' },
    { a: 0, b: 5, labelA: '0-5', labelB: '5-0' },
  ]
  
  return (
    <div className="space-y-6">
      {/* Option A */}
      <div 
        className={`
          p-4 rounded-lg border-2 transition-all
          ${pointsA > pointsB 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <div className="flex items-start gap-3 mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isRTL ? 'أ' : 'A'}
          </span>
          <p className={`flex-1 text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
            {optionA}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {pointsA}
          </span>
          <span className="text-sm text-gray-500">
            {t('assessment.sais.points', { defaultValue: 'points' })}
          </span>
        </div>
      </div>
      
      {/* Slider */}
      <div className="px-2 py-4">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[pointsA]}
          onValueChange={handleSliderChange}
          max={totalPoints}
          step={1}
          disabled={disabled}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb 
            className="block w-5 h-5 bg-white dark:bg-gray-800 border-2 border-indigo-500 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-grab active:cursor-grabbing"
          />
        </Slider.Root>
        
        {/* Quick selection buttons */}
        <div className={`flex justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {distributionOptions.map((option) => (
            <button
              key={option.a}
              onClick={() => handlePointButtonClick(option.a)}
              disabled={disabled}
              className={`
                px-2 py-1 text-xs rounded-md transition-all
                ${pointsA === option.a && pointsB === option.b
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                active:scale-95
              `}
            >
              {isRTL ? option.labelB : option.labelA}
            </button>
          ))}
        </div>
      </div>
      
      {/* Option B */}
      <div 
        className={`
          p-4 rounded-lg border-2 transition-all
          ${pointsB > pointsA 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <div className="flex items-start gap-3 mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isRTL ? 'ب' : 'B'}
          </span>
          <p className={`flex-1 text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
            {optionB}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {pointsB}
          </span>
          <span className="text-sm text-gray-500">
            {t('assessment.sais.points', { defaultValue: 'points' })}
          </span>
        </div>
      </div>
      
      {/* Validation message */}
      <div className={`text-center text-sm ${pointsA + pointsB === totalPoints ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {pointsA + pointsB === totalPoints
          ? t('assessment.sais.validDistribution', { defaultValue: 'Distribution is valid (5 points total)' })
          : t('assessment.sais.invalidDistribution', { defaultValue: `Invalid distribution: ${pointsA + pointsB} points (must be 5)` })
        }
      </div>
    </div>
  )
}