'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { H1, H2, Text, MBTICode } from '@/components/ui/Typography'
import { ProgressBar } from '@/components/assessment/ProgressBar'

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
    if (!sessionId) {
      router.push(`/${language}`)
      return
    }
    
    setCurrentStep('interim-results')
    
    if (!interimEnabled) {
      router.push(`/${language}/assessment/format`)
      return
    }

    const fetchInterimResults = async () => {
      const coreResponses = responses.filter(r => r.questionType === 'core')
      
      if (coreResponses.length < 4) {
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
        updateProgress(30)
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
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <Text variant="muted">{t('interim.loading')}</Text>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent>
            <Text variant="error" className="mb-4">{error}</Text>
            <Button onClick={() => router.push(`/${language}/assessment/core`)}>
              {t('common.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-primary dark:gradient-secondary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar current={4} total={16} showLabel={true} labelText={t('assessment.progress')} />
        </div>

        <Card className="animate-fade-in">
          <CardContent className="p-8 tablet:p-10">
            <div className="text-center mb-8">
              <H1 className="mb-2">{t('interim.title')}</H1>
              <Text variant="muted">{t('interim.subtitle')}</Text>
            </div>

            {interimResults && (
              <>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                    <MBTICode code={interimResults.mbtiType} size="large" />
                  </div>
                  <Text variant="small" className="text-neutral-500 dark:text-neutral-400">
                    {t('interim.confidenceLevel', { confidence: interimResults.confidence })}
                  </Text>
                </div>

                <div className="space-y-4 mb-8">
                  <H2 className="mb-4">{t('interim.insightsTitle')}</H2>
                  {interimResults.insights.map((insight, index) => (
                    <Card key={index} variant="default" noPadding>
                      <CardContent className="p-4">
                        <Text>{insight}</Text>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 mb-8" noPadding>
                  <CardContent className="p-4">
                    <Text variant="small">
                      <span className="font-semibold">{t('interim.note')}: </span>
                      {interimResults.disclaimer}
                    </Text>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button 
                    onClick={handleContinue}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {t('interim.continueButton')}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}