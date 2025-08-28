'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { Button } from '@/components/ui/Button'

export default function InterimResultsPage() {
  const interimEnabled = process.env.NEXT_PUBLIC_INTERIM_RESULTS_ENABLED !== 'false'
  const router = useRouter()
  const { t } = useTranslation()
  const { 
    sessionId, 
    responses, 
    language, 
    interimResults, 
    setInterimResults,
    setCurrentStep,
    updateProgress
  } = useAssessmentStore()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Interim page - responses:', responses.length, 'sessionId:', sessionId)
    
    // Don't process if no session
    if (!sessionId) {
      console.error('No session ID found, redirecting to home')
      router.push(`/${language}`)
      return
    }
    
    // Update current step 
    setCurrentStep('interim-results')
    
    if (!interimEnabled) {
      router.push(`/${language}/assessment/format`)
      return
    }

    // Calculate interim results
    const fetchInterimResults = async () => {
      // Debug logging
      console.log('All responses:', responses);
      console.log('Response details:', responses.map(r => ({
        id: r.questionId,
        type: r.questionType,
        dimension: r.mbtiDimension,
        option: r.selectedOption
      })));
      
      // Filter only core questions responses
      const coreResponses = responses.filter(r => r.questionType === 'core')
      console.log('Core responses found:', coreResponses.length);
      
      if (coreResponses.length < 4) {
        console.error('Not enough core responses:', coreResponses.length, 'Total responses:', responses.length)
        // If we have some responses but not all 4, something went wrong
        if (coreResponses.length > 0 && coreResponses.length < 4) {
          console.error('Partial responses detected, state might be corrupted')
        }
        // Wait a bit before redirecting to allow state to update
        setTimeout(() => {
          router.push(`/${language}/assessment/core`)
        }, 500)
        return
      }

      try {
        const response = await fetch('/api/assessment/calculate-interim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, responses: coreResponses, language }),
        })

        if (!response.ok) {
          throw new Error('Failed to calculate interim results')
        }

        const data = await response.json()
        setInterimResults(data.interimResult)
        updateProgress(30) // 30% complete after core questions
        setLoading(false)
      } catch (err) {
        console.error('Error fetching interim results:', err)
        setError(t('interim.error'))
        setLoading(false)
      }
    }

    fetchInterimResults()
  }, [sessionId, responses, language, interimEnabled, router, setInterimResults, updateProgress, t, setCurrentStep])

  const handleContinue = () => {
    setCurrentStep('format-selection')
    router.push(`/${language}/assessment/format`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('interim.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => router.push(`/${language}/assessment/core`)} className="mt-4">
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('interim.title')}
          </h1>
          <p className="text-gray-600">
            {t('interim.subtitle')}
          </p>
        </div>

        {interimResults && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-indigo-100 rounded-full mb-4">
                <span className="text-4xl font-bold text-indigo-600">
                  {interimResults.mbtiType}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {t('interim.confidenceLevel', { confidence: interimResults.confidence })}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {t('interim.insightsTitle')}
              </h2>
              {interimResults.insights.map((insight, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{t('interim.note')}: </span>
                {interimResults.disclaimer}
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {t('interim.continueButton')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}