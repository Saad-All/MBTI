'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { useAssessmentPersistence } from '@/lib/hooks/useAssessmentPersistence'
import { QuestionCard } from '@/components/assessment/QuestionCard'
import { SAISDistribution } from '@/components/assessment/SAISDistribution'
import { ProgressBar } from '@/components/assessment/ProgressBar'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { QuestionResponse, MBTIDimension } from '@/lib/types'
import saisArQuestions from '@/data/questions/sais-ar.json'
import saisEnQuestions from '@/data/questions/sais-en.json'

interface SAISAssessmentProps {
  params: { locale: string }
}

interface SAISQuestion {
  id: string
  dimension: string
  statement: string
  optionA: string
  optionB: string
  optionATendency: string
  optionBTendency: string
}

export default function SAISAssessment({ params: { locale } }: SAISAssessmentProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentDistribution, setCurrentDistribution] = useState({ pointsA: 2, pointsB: 3 })
  
  const {
    sessionId,
    language,
    setLanguage,
    addResponse,
    responses,
    setProgress,
    setCurrentStep,
    selectedFormat,
    interimResults
  } = useAssessmentPersistence()

  // Initialize language on mount
  useEffect(() => {
    setLanguage(locale as 'ar' | 'en')
    setCurrentStep('questions')
  }, [locale, setLanguage, setCurrentStep])

  // Redirect if no session or wrong format
  useEffect(() => {
    if (!sessionId || selectedFormat !== 'sais') {
      router.push(`/${locale}`)
    }
  }, [sessionId, selectedFormat, locale, router])

  // Get questions based on language
  const questions: SAISQuestion[] = language === 'ar' 
    ? saisArQuestions.assessment.sais.questions 
    : saisEnQuestions.assessment.sais.questions

  const intro = language === 'ar' 
    ? saisArQuestions.assessment.sais.intro
    : saisEnQuestions.assessment.sais.intro

  const instructions = language === 'ar'
    ? saisArQuestions.assessment.sais.instructions
    : saisEnQuestions.assessment.sais.instructions

  // Calculate total progress (core questions + SAIS questions)
  const totalCoreQuestions = 4 // From core assessment
  const currentTotalQuestion = totalCoreQuestions + currentQuestionIndex + 1
  const totalQuestions = totalCoreQuestions + questions.length

  // Update progress
  useEffect(() => {
    const progress = (currentTotalQuestion / totalQuestions) * 100
    setProgress(progress)
  }, [currentTotalQuestion, totalQuestions, setProgress])

  // Check if current question was already answered
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex]
    const existingResponse = responses.find(
      (r) => r.questionId === currentQuestion.id
    )
    if (existingResponse && existingResponse.distributionA !== undefined && existingResponse.distributionB !== undefined) {
      setCurrentDistribution({
        pointsA: existingResponse.distributionA,
        pointsB: existingResponse.distributionB
      })
    } else {
      setCurrentDistribution({ pointsA: 2, pointsB: 3 })
    }
  }, [currentQuestionIndex, responses, questions])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleDistribute = (pointsA: number, pointsB: number) => {
    setCurrentDistribution({ pointsA, pointsB })
  }

  const handleNext = () => {
    if (!sessionId || currentDistribution.pointsA + currentDistribution.pointsB !== 5) return

    // Create response
    const response: QuestionResponse = {
      responseId: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      questionId: currentQuestion.id,
      questionType: 'extended',
      responseType: 'distribution',
      distributionA: currentDistribution.pointsA,
      distributionB: currentDistribution.pointsB,
      mbtiDimension: currentQuestion.dimension as MBTIDimension,
      score: 0,
      timestamp: new Date(),
      selectedOption: currentDistribution.pointsA > currentDistribution.pointsB ? 'A' : 'B',
      tendency: currentDistribution.pointsA > currentDistribution.pointsB 
        ? currentQuestion.optionATendency 
        : currentQuestion.optionBTendency,
    }

    // Add response to store
    addResponse(response)

    // Navigate to next question or results
    if (isLastQuestion) {
      setTimeout(() => {
        router.push(`/${locale}/assessment/results`)
      }, 100)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      // Go back to format selection
      router.push(`/${locale}/assessment/format`)
    }
  }

  if (!sessionId || selectedFormat !== 'sais') {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="absolute top-0 right-0 p-6">
        <LanguageToggle />
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl safe-bottom">
        {/* Title and Instructions */}
        {currentQuestionIndex === 0 && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {intro.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {intro.description}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {instructions.title}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {instructions.examples.map((example, index) => (
                  <li key={index} className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    • {example}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar
            current={currentTotalQuestion}
            total={totalQuestions}
            showLabel={true}
            labelText={t('assessment.sais.progress', {
              current: currentTotalQuestion,
              total: totalQuestions,
              defaultValue: `Question ${currentTotalQuestion} of ${totalQuestions}`
            })}
          />
        </div>

        {/* Question */}
        <QuestionCard question={currentQuestion.statement}>
          <SAISDistribution
            optionA={currentQuestion.optionA}
            optionB={currentQuestion.optionB}
            optionATendency={currentQuestion.optionATendency}
            optionBTendency={currentQuestion.optionBTendency}
            initialDistribution={currentDistribution}
            onDistribute={handleDistribute}
          />
        </QuestionCard>

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={handleBack}
            className="px-4 md:px-6 py-3 rounded-lg font-medium transition-all
              touch-target no-select flex-1 md:flex-initial
              bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
              hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-[0.98]"
          >
            {t('assessment.sais.back', { defaultValue: 'Back' })}
          </button>

          <button
            onClick={handleNext}
            disabled={currentDistribution.pointsA + currentDistribution.pointsB !== 5}
            className={`
              px-4 md:px-6 py-3 rounded-lg font-medium transition-all
              touch-target no-select flex-1 md:flex-initial
              ${
                currentDistribution.pointsA + currentDistribution.pointsB === 5
                  ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isLastQuestion 
              ? t('assessment.sais.complete', { defaultValue: 'Complete Assessment' })
              : t('assessment.sais.next', { defaultValue: 'Next' })
            }
          </button>
        </div>
      </div>
    </main>
  )
}