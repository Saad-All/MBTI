'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore, useAppStore } from '@/lib/stores/assessment-store'

export default function ProcessingPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation('common')
  const { 
    coreResponses, 
    extendedResponses, 
    selectedFormat,
    sessionId
  } = useAssessmentStore()
  
  const [processingStartTime] = useState(Date.now())
  const [error, setError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(true)
  
  const locale = i18n.language

  useEffect(() => {
    const calculateResults = async () => {
      try {
        // Basic validation
        if (!sessionId || !selectedFormat) {
          throw new Error('Invalid session state')
        }

        // Prepare responses for calculation
        const allResponses = [...coreResponses, ...extendedResponses]
        
        // Ensure we have all 16 responses for SAIS
        if (selectedFormat === 'sais' && allResponses.length !== 16) {
          throw new Error('Incomplete assessment responses')
        }

        // Call calculation API
        const response = await fetch('/api/assessment/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            responses: allResponses,
            methodology: selectedFormat
          })
        })

        if (!response.ok) {
          throw new Error('Calculation failed')
        }

        const results = await response.json()
        
        // Performance monitoring - ensure under 3 seconds
        const processingTime = Date.now() - processingStartTime
        if (processingTime > 3000) {
          console.warn('Processing exceeded 3 second target:', processingTime)
        }

        // Store results and route to appropriate page
        const store = useAppStore.getState()
        store.setResults(results)
        
        // Route based on format
        if (selectedFormat === 'sais') {
          router.push(`/${locale}/results/sais`)
        } else {
          router.push(`/${locale}/results`)
        }
        
      } catch (err) {
        console.error('Calculation error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsCalculating(false)
      }
    }

    calculateResults()
  }, [])

  const handleRetry = () => {
    setError(null)
    setIsCalculating(true)
    window.location.reload()
  }

  const handleBackToAssessment = () => {
    router.push(`/${locale}/assessment/${selectedFormat}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center p-8 max-w-md">
        {isCalculating && !error ? (
          <>
            {/* Basic CSS spinner */}
            <div className="mb-8">
              <div className="inline-block w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('assessment.processing.title', 'جاري حساب نمط شخصيتك...')}
            </h2>
            
            <p className="text-gray-600">
              {t('assessment.processing.subtitle', 'Please wait while we analyze your responses')}
            </p>
          </>
        ) : error ? (
          <>
            {/* Error state */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('assessment.processing.error.title', 'Something went wrong')}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {t('assessment.processing.error.message', 'We were unable to calculate your results. Please try again.')}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t('assessment.processing.error.retry', 'Try Again')}
              </button>
              
              <button
                onClick={handleBackToAssessment}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('assessment.processing.error.back', 'Back to Assessment')}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}