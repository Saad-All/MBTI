'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { Language } from '@/lib/types'
import { getButtonRTLClasses } from '@/lib/utils/rtl-helpers'
import { useState, useEffect } from 'react'

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage } = useAssessmentStore()
  const [isLoading, setIsLoading] = useState(false)
  
  // Persist language preference in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language
    if (savedLanguage && savedLanguage !== language) {
      setLanguage(savedLanguage)
    }
  }, [language, setLanguage])
  
  const toggleLanguage = async () => {
    const newLang: Language = language === 'en' ? 'ar' : 'en'
    setIsLoading(true)
    
    try {
      // Update state
      setLanguage(newLang)
      
      // Persist preference
      localStorage.setItem('preferredLanguage', newLang)
      
      // Replace locale in pathname
      const segments = pathname.split('/')
      segments[1] = newLang
      
      // Navigate to new URL
      await router.push(segments.join('/'))
    } catch (error) {
      console.error('Language toggle error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttonClasses = getButtonRTLClasses(language, true)

  return (
    <button
      onClick={toggleLanguage}
      disabled={isLoading}
      className={`
        ${buttonClasses}
        flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 
        hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${language === 'ar' ? 'font-arabic' : 'font-sans'}
      `}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {isLoading ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      ) : (
        <svg
          className={`w-4 h-4 ${language === 'ar' ? 'rtl-flip' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      )}
      <span className="text-sm font-medium">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  )
}