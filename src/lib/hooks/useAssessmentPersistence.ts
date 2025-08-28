'use client'

import { useEffect } from 'react'
import { useAssessmentStore } from '@/lib/stores/assessment-store'

const SESSION_STORAGE_KEY = 'mbti-assessment-session'

export function useAssessmentPersistence() {
  const assessmentState = useAssessmentStore()

  // Save to sessionStorage on state changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stateToSave = {
      sessionId: assessmentState.sessionId,
      currentStep: assessmentState.currentStep,
      language: assessmentState.language,
      responses: assessmentState.responses,
      selectedFormat: assessmentState.selectedFormat,
      progress: assessmentState.progress,
      isComplete: assessmentState.isComplete,
    }

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error)
    }
  }, [
    assessmentState.sessionId,
    assessmentState.currentStep,
    assessmentState.language,
    assessmentState.responses,
    assessmentState.selectedFormat,
    assessmentState.progress,
    assessmentState.isComplete,
  ])

  // Restore from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedState = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        
        // Only restore if there's an active session
        if (parsedState.sessionId && !assessmentState.sessionId) {
          assessmentState.setSessionId(parsedState.sessionId)
          assessmentState.setCurrentStep(parsedState.currentStep)
          assessmentState.setLanguage(parsedState.language)
          assessmentState.setSelectedFormat(parsedState.selectedFormat)
          assessmentState.setProgress(parsedState.progress)
          
          // Restore responses - set all at once
          if (assessmentState.responses.length === 0 && parsedState.responses.length > 0) {
            const restoredResponses = parsedState.responses.map((response: any) => ({
              ...response,
              timestamp: new Date(response.timestamp),
            }))
            assessmentState.setResponses(restoredResponses)
          }
        }
      }
    } catch (error) {
      console.error('Failed to restore from sessionStorage:', error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  return assessmentState
}