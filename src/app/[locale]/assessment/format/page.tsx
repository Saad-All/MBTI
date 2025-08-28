'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { Button } from '@/components/ui/Button'

type FormatType = 'scenarios' | 'traits' | 'sais'

interface FormatOption {
  id: FormatType
  titleKey: string
  descriptionKey: string
  questionStyleKey: string
  scoringMethodKey: string
  resultFocusKey: string
  icon: string
}

const formatOptions: FormatOption[] = [
  {
    id: 'scenarios',
    titleKey: 'format.scenarios.title',
    descriptionKey: 'format.scenarios.description',
    questionStyleKey: 'format.scenarios.questionStyle',
    scoringMethodKey: 'format.scenarios.scoringMethod',
    resultFocusKey: 'format.scenarios.resultFocus',
    icon: '🎭'
  },
  {
    id: 'traits',
    titleKey: 'format.traits.title',
    descriptionKey: 'format.traits.description',
    questionStyleKey: 'format.traits.questionStyle',
    scoringMethodKey: 'format.traits.scoringMethod',
    resultFocusKey: 'format.traits.resultFocus',
    icon: '⚖️'
  },
  {
    id: 'sais',
    titleKey: 'format.sais.title',
    descriptionKey: 'format.sais.description',
    questionStyleKey: 'format.sais.questionStyle',
    scoringMethodKey: 'format.sais.scoringMethod',
    resultFocusKey: 'format.sais.resultFocus',
    icon: '🧠'
  }
]

export default function FormatSelectionPage() {
  const formatSelectionEnabled = process.env.NEXT_PUBLIC_FORMAT_SELECTION_ENABLED !== 'false'
  const router = useRouter()
  const { t } = useTranslation()
  const { 
    language, 
    selectedFormat, 
    setSelectedFormat, 
    setCurrentStep,
    updateProgress 
  } = useAssessmentStore()
  
  const [selected, setSelected] = useState<FormatType | null>(selectedFormat)

  useEffect(() => {
    // If format selection is disabled, auto-select scenarios
    if (!formatSelectionEnabled) {
      setSelectedFormat('scenarios')
      setCurrentStep('questions')
      router.push(`/${language}/assessment/scenarios`)
      return
    }

    // If format already selected, show it as selected
    if (selectedFormat) {
      setSelected(selectedFormat)
    }
  }, [formatSelectionEnabled, selectedFormat, language, router, setSelectedFormat, setCurrentStep])

  const handleFormatSelect = (format: FormatType) => {
    setSelected(format)
  }

  const handleContinue = () => {
    if (!selected) return

    // Save the selection
    setSelectedFormat(selected)
    setCurrentStep('questions')
    updateProgress(40) // 40% progress after format selection
    
    // Navigate to the appropriate assessment path
    router.push(`/${language}/assessment/${selected}`)
  }

  if (!formatSelectionEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>{t('format.preparingAssessment')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('format.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('format.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {formatOptions.map((format) => (
            <div
              key={format.id}
              onClick={() => handleFormatSelect(format.id)}
              className={`
                relative bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all
                ${selected === format.id ? 'ring-4 ring-blue-500 transform scale-105' : 'hover:shadow-xl hover:scale-102'}
              `}
            >
              {selected === format.id && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="text-4xl mb-4">{format.icon}</div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {t(format.titleKey)}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {t(format.descriptionKey)}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-2">{t('format.questionStyle')}:</span>
                  <span className="text-gray-600">{t(format.questionStyleKey)}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-2">{t('format.scoringMethod')}:</span>
                  <span className="text-gray-600">{t(format.scoringMethodKey)}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-2">{t('format.resultFocus')}:</span>
                  <span className="text-gray-600">{t(format.resultFocusKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selected}
            size="lg"
            className={`
              ${selected 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                : 'bg-gray-300 cursor-not-allowed'}
            `}
          >
            {t('format.continueButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}