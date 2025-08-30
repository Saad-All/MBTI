'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { Language } from '@/lib/types'
import { getButtonRTLClasses } from '@/lib/utils/rtl-helpers'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface LanguageToggleProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function LanguageToggle({ variant = 'default', className = '' }: LanguageToggleProps) {
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

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        disabled={isLoading}
        className={`
          ${buttonClasses}
          ${className}
          inline-flex items-center justify-center
          w-10 h-10 rounded-lg
          bg-surface-secondary hover:bg-surface-tertiary
          border border-border-primary hover:border-border-secondary
          text-content-primary
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          dark:focus:ring-offset-surface-primary
        `}
        aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        {isLoading ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-border-primary border-t-primary" />
        ) : (
          <span className="text-sm font-semibold">
            {language === 'en' ? 'ع' : 'EN'}
          </span>
        )}
      </button>
    )
  }

  return (
    <Button
      onClick={toggleLanguage}
      disabled={isLoading}
      variant="secondary"
      size="sm"
      className={`${buttonClasses} ${className}`}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {isLoading ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-surface-secondary border-t-white" />
      ) : (
        <svg
          className={`w-4 h-4 ${language === 'ar' ? 'rtl:scale-x-[-1]' : ''}`}
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
      <span className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  )
}