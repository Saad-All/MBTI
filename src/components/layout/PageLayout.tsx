'use client'

import { ReactNode } from 'react'
import { Container } from './Container'
import { useAssessmentStore } from '@/lib/stores/assessment-store'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  padded?: boolean
}

export function PageLayout({ 
  children, 
  className = '',
  containerSize = 'lg',
  centered = false,
  padded = true
}: PageLayoutProps) {
  const { language } = useAssessmentStore()
  
  return (
    <main 
      className={`
        min-h-screen bg-surface-primary
        ${padded ? 'py-8 sm:py-12 lg:py-16' : ''}
        ${centered ? 'flex items-center justify-center' : ''}
        ${language === 'ar' ? 'rtl' : 'ltr'}
        ${className}
      `}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Container size={containerSize} className={centered ? '' : 'h-full'}>
        {children}
      </Container>
    </main>
  )
}