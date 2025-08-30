'use client'

import { useState, useEffect } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Text, Label } from '@/components/ui/Typography'
import { triggerHapticFeedback } from '@/lib/utils/animations'
import { clsx } from 'clsx'

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
    
    // Trigger haptic feedback on point changes
    if (newPointsA !== pointsA) {
      triggerHapticFeedback('light')
    }
    
    setPointsA(newPointsA)
    setPointsB(newPointsB)
    
    onDistribute(newPointsA, newPointsB)
  }
  
  const handlePointButtonClick = (pointsForA: number) => {
    const newPointsA = pointsForA
    const newPointsB = totalPoints - pointsForA
    
    // Trigger haptic feedback for button clicks
    triggerHapticFeedback('medium')
    
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
      <Card 
        variant={pointsA > pointsB ? 'selected' : 'default'}
        className="p-4 transition-all duration-200"
      >
        <div className="flex items-start gap-3 mb-2 rtl:flex-row-reverse">
          <Label className="text-content-tertiary">
            {isRTL ? 'أ' : 'A'}
          </Label>
          <Text className="flex-1 text-content-primary">
            {optionA}
          </Text>
        </div>
        <div className="flex items-center gap-2 rtl:flex-row-reverse">
          <span className={clsx(
            "text-2xl font-bold text-primary transition-all duration-150",
            "data-[changing=true]:animate-point-allocate"
          )}>
            {pointsA}
          </span>
          <Text variant="small" className="text-content-tertiary">
            {t('assessment.sais.points', { defaultValue: 'points' })}
          </Text>
        </div>
      </Card>
      
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
          <Slider.Track className="bg-surface-tertiary dark:bg-surface-secondary relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-accent rounded-full h-full transition-all duration-150" />
          </Slider.Track>
          <Slider.Thumb 
            className="block w-5 h-5 bg-white dark:bg-surface-primary border-2 border-accent rounded-full hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-grab active:cursor-grabbing transition-all duration-150 active:scale-110"
          />
        </Slider.Root>
        
        {/* Quick selection buttons */}
        <div className="flex justify-between mt-4 rtl:flex-row-reverse">
          {distributionOptions.map((option) => (
            <button
              key={option.a}
              onClick={() => handlePointButtonClick(option.a)}
              disabled={disabled}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150
                ${pointsA === option.a && pointsB === option.b
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-surface-secondary hover:bg-surface-tertiary text-content-secondary hover:text-content-primary'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1
                dark:focus:ring-offset-surface-primary
              `}
              aria-label={`Distribute ${option.a} points to A and ${option.b} points to B`}
            >
              {isRTL ? option.labelB : option.labelA}
            </button>
          ))}
        </div>
      </div>
      
      {/* Option B */}
      <Card 
        variant={pointsB > pointsA ? 'selected' : 'default'}
        className="p-4 transition-all duration-200"
      >
        <div className="flex items-start gap-3 mb-2 rtl:flex-row-reverse">
          <Label className="text-content-tertiary">
            {isRTL ? 'ب' : 'B'}
          </Label>
          <Text className="flex-1 text-content-primary">
            {optionB}
          </Text>
        </div>
        <div className="flex items-center gap-2 rtl:flex-row-reverse">
          <span className="text-2xl font-bold text-primary">
            {pointsB}
          </span>
          <Text variant="small" className="text-content-tertiary">
            {t('assessment.sais.points', { defaultValue: 'points' })}
          </Text>
        </div>
      </Card>
      
      {/* Validation message */}
      <div className="text-center">
        <Text 
          variant="small" 
          className={pointsA + pointsB === totalPoints ? 'text-success' : 'text-error'}
        >
          {pointsA + pointsB === totalPoints
            ? t('assessment.sais.validDistribution', { defaultValue: 'Distribution is valid (5 points total)' })
            : t('assessment.sais.invalidDistribution', { defaultValue: `Invalid distribution: ${pointsA + pointsB} points (must be 5)` })
          }
        </Text>
      </div>
    </div>
  )
}