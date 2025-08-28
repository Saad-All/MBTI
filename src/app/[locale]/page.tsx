'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { useAssessmentPersistence } from '@/lib/hooks/useAssessmentPersistence'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { Language } from '@/lib/types'
import { useEffect } from 'react'

interface HomeProps {
  params: { locale: string }
}

export default function Home({ params: { locale } }: HomeProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { setSessionId, setLanguage, setCurrentStep, resetAssessment, sessionId, currentStep } = useAssessmentPersistence()

  useEffect(() => {
    setLanguage(locale as Language)
  }, [locale, setLanguage])

  // Check if user has an ongoing assessment
  useEffect(() => {
    if (sessionId && (currentStep === 'questions' || currentStep === 'core-questions')) {
      // Automatically redirect to continue assessment
      router.push(`/${locale}/assessment/core`)
    }
  }, [sessionId, currentStep, locale, router])

  const handleStartAssessment = () => {
    // Generate new session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Reset any previous assessment data
    resetAssessment()
    
    // Initialize new session
    setSessionId(sessionId)
    setLanguage(locale as Language)
    setCurrentStep('core-questions')
    
    // Navigate to core questions
    router.push(`/${locale}/assessment/core`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="absolute top-0 right-0 p-6">
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
            {t('home.hero.subtitle')}
          </p>
          
          {/* Time Commitment Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{t('home.hero.timeCommitment')}</span>
          </div>
          
          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={handleStartAssessment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {t('home.hero.startButton')}
            </button>
          </div>
          
          {/* Benefits Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
              {t('home.hero.benefits.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('home.hero.benefits.benefit1')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('home.hero.benefits.benefit2')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('home.hero.benefits.benefit3')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('home.hero.benefits.benefit4')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}