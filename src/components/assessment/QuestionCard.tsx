'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { H2 } from '@/components/ui/Typography'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { clsx } from 'clsx'

interface QuestionCardProps {
  question: string
  children: React.ReactNode
  className?: string
  questionIndex?: number
}

export function QuestionCard({ question, children, className = '', questionIndex = 0 }: QuestionCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const { language } = useAssessmentStore()
  const isRTL = language === 'ar'
  
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [questionIndex])
  
  const slideDirection = isRTL ? 'animate-slide-in-left' : 'animate-slide-in-right'
  
  return (
    <Card 
      className={clsx(
        'p-8 md:p-10 transition-all duration-300 ease-out',
        isAnimating && slideDirection,
        className
      )}
    >
      <H2 className="mb-8 text-content-primary transition-opacity duration-300 ease-out">
        {question}
      </H2>
      <div className="transition-all duration-300 ease-out">{children}</div>
    </Card>
  )
}