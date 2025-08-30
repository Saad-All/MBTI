'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { H1, H2, H3, Text } from '@/components/ui/Typography'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ResultsPage() {
  const router = useRouter()
  const { i18n } = useTranslation('common')
  const { selectedFormat, results } = useAssessmentStore()
  const locale = i18n.language
  
  useEffect(() => {
    // Route to format-specific results page if available
    if (selectedFormat === 'sais') {
      router.push(`/${locale}/results/sais`)
    } else if (!results) {
      // If no results, redirect to home
      router.push('/')
    }
  }, [selectedFormat, results, router, locale])
  
  // Basic results display for non-SAIS formats (placeholder)
  if (!results) {
    return (
      <PageLayout containerSize="sm" centered>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <Text className="mt-4 text-content-secondary">Loading results...</Text>
        </div>
      </PageLayout>
    )
  }
  
  return (
    <PageLayout containerSize="md" className="bg-gradient-primary">
      <div className="py-8 md:py-16">
        <H1 className="text-center mb-8 text-content-primary animate-fade-in">
          Your Results
        </H1>
        
        <Card className="p-8 md:p-12 animate-fade-in animation-delay-100">
          <div className="text-center mb-8">
            <H2 className="text-primary mb-2">
              {results.mbtiType}
            </H2>
            <Text className="text-content-secondary">
              {results.methodology} Methodology
            </Text>
          </div>
          
          <div className="space-y-6">
            <div className="text-center p-6 bg-surface-secondary rounded-lg">
              <Text className="text-content-tertiary mb-2">Overall Confidence</Text>
              <div className="text-3xl font-bold text-primary">
                {results.confidence}%
              </div>
            </div>
            
            <div className="border-t border-border-primary pt-6">
              <H3 className="mb-4 text-content-primary">Dimension Scores</H3>
              <div className="space-y-3">
                {Object.entries(results.scores).map(([dimension, score]) => (
                  <div key={dimension} className="flex justify-between items-center p-3 bg-surface-secondary rounded-lg">
                    <Text className="font-medium text-content-primary">{dimension}</Text>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-surface-tertiary rounded-full h-2">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <Text className="font-semibold text-content-primary w-12 text-right">
                        {score}%
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mt-8 text-center animate-fade-in animation-delay-200">
          <Text className="text-content-tertiary">
            Full results display for {selectedFormat} format coming soon...
          </Text>
        </div>
      </div>
    </PageLayout>
  )
}