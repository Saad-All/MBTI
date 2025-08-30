'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'

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
    return null
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Results
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            {results.mbtiType}
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Confidence: {results.confidence}%</p>
              <p className="text-gray-600">Methodology: {results.methodology}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Dimension Scores:</h3>
              <div className="space-y-2">
                {Object.entries(results.scores).map(([dimension, score]) => (
                  <div key={dimension} className="flex justify-between">
                    <span>{dimension}:</span>
                    <span>{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Full results display for {selectedFormat} format coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}