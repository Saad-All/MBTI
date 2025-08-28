import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { QuestionResponse } from '@/lib/types'

export type AssessmentStep = 'welcome' | 'core-questions' | 'interim-results' | 'format-selection' | 'questions' | 'results' | 'coaching'

export interface AssessmentState {
  sessionId: string
  currentStep: AssessmentStep
  language: 'en' | 'ar'
  responses: QuestionResponse[]
  selectedFormat: 'scenarios' | 'traits' | 'sais' | null
  progress: number
  isComplete: boolean
  interimResults?: {
    mbtiType: string
    confidence: number
    insights: string[]
    disclaimer: string
  }
}

export interface UIState {
  theme: 'light' | 'dark'
  direction: 'ltr' | 'rtl'
  sidebarOpen: boolean
  currentPage: string
}

export interface AppStore {
  assessment: AssessmentState
  ui: UIState
  
  // Assessment actions
  setSessionId: (sessionId: string) => void
  setCurrentStep: (step: AssessmentStep) => void
  setLanguage: (language: 'en' | 'ar') => void
  addResponse: (response: QuestionResponse) => void
  setResponses: (responses: QuestionResponse[]) => void
  setSelectedFormat: (format: 'scenarios' | 'traits' | 'sais') => void
  updateProgress: (progress: number) => void
  setProgress: (progress: number) => void
  completeAssessment: () => void
  resetAssessment: () => void
  setInterimResults: (results: AssessmentState['interimResults']) => void
  
  // UI actions
  setTheme: (theme: 'light' | 'dark') => void
  setDirection: (direction: 'ltr' | 'rtl') => void
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
}

const initialAssessmentState: AssessmentState = {
  sessionId: '',
  currentStep: 'welcome',
  language: 'en',
  responses: [],
  selectedFormat: null,
  progress: 0,
  isComplete: false,
}

const initialUIState: UIState = {
  theme: 'light',
  direction: 'ltr',
  sidebarOpen: false,
  currentPage: 'home',
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        assessment: initialAssessmentState,
        ui: initialUIState,
        
        // Assessment actions
        setSessionId: (sessionId) =>
          set((state) => ({
            assessment: { ...state.assessment, sessionId }
          })),
          
        setCurrentStep: (currentStep) =>
          set((state) => ({
            assessment: { ...state.assessment, currentStep }
          })),
          
        setLanguage: (language) =>
          set((state) => ({
            assessment: { ...state.assessment, language },
            ui: { ...state.ui, direction: language === 'ar' ? 'rtl' : 'ltr' }
          })),
          
        addResponse: (response) =>
          set((state) => {
            // Check if response already exists for this question
            const existingIndex = state.assessment.responses.findIndex(
              r => r.questionId === response.questionId
            )
            
            let newResponses
            if (existingIndex >= 0) {
              // Replace existing response
              newResponses = [...state.assessment.responses]
              newResponses[existingIndex] = response
            } else {
              // Add new response
              newResponses = [...state.assessment.responses, response]
            }
            
            return {
              assessment: {
                ...state.assessment,
                responses: newResponses
              }
            }
          }),
          
        setResponses: (responses) =>
          set((state) => ({
            assessment: { ...state.assessment, responses }
          })),
          
        setSelectedFormat: (selectedFormat) =>
          set((state) => ({
            assessment: { ...state.assessment, selectedFormat }
          })),
          
        updateProgress: (progress) =>
          set((state) => ({
            assessment: { ...state.assessment, progress }
          })),
          
        setProgress: (progress) =>
          set((state) => ({
            assessment: { ...state.assessment, progress }
          })),
          
        completeAssessment: () =>
          set((state) => ({
            assessment: { ...state.assessment, isComplete: true, currentStep: 'results' }
          })),
          
        resetAssessment: () =>
          set((state) => ({
            assessment: { ...initialAssessmentState, language: state.assessment.language }
          })),
          
        setInterimResults: (interimResults) =>
          set((state) => ({
            assessment: { ...state.assessment, interimResults }
          })),
          
        // UI actions
        setTheme: (theme) =>
          set((state) => ({
            ui: { ...state.ui, theme }
          })),
          
        setDirection: (direction) =>
          set((state) => ({
            ui: { ...state.ui, direction }
          })),
          
        toggleSidebar: () =>
          set((state) => ({
            ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
          })),
          
        setCurrentPage: (currentPage) =>
          set((state) => ({
            ui: { ...state.ui, currentPage }
          })),
      }),
      {
        name: 'mbti-app-store',
        partialize: (state) => ({ 
          assessment: state.assessment,
          ui: { theme: state.ui.theme, direction: state.ui.direction }
        }),
      }
    ),
    { name: 'MBTI App Store' }
  )
)

// Selector hooks for better performance
export const useAssessmentStore = () => useAppStore((state) => ({
  sessionId: state.assessment.sessionId,
  currentStep: state.assessment.currentStep,
  language: state.assessment.language,
  responses: state.assessment.responses,
  selectedFormat: state.assessment.selectedFormat,
  progress: state.assessment.progress,
  isComplete: state.assessment.isComplete,
  interimResults: state.assessment.interimResults,
  setSessionId: state.setSessionId,
  setCurrentStep: state.setCurrentStep,
  setLanguage: state.setLanguage,
  addResponse: state.addResponse,
  setResponses: state.setResponses,
  setSelectedFormat: state.setSelectedFormat,
  updateProgress: state.updateProgress,
  setProgress: state.setProgress,
  completeAssessment: state.completeAssessment,
  resetAssessment: state.resetAssessment,
  setInterimResults: state.setInterimResults,
}))

export const useUIStore = () => useAppStore((state) => ({
  theme: state.ui.theme,
  direction: state.ui.direction,
  sidebarOpen: state.ui.sidebarOpen,
  currentPage: state.ui.currentPage,
  setTheme: state.setTheme,
  setDirection: state.setDirection,
  toggleSidebar: state.toggleSidebar,  
  setCurrentPage: state.setCurrentPage,
}))

