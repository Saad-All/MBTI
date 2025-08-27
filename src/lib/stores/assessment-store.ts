import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type AssessmentStep = 'welcome' | 'format-selection' | 'questions' | 'results' | 'coaching'

export interface QuestionResponse {
  questionId: string
  score: number
  timestamp: Date
}

export interface AssessmentState {
  sessionId: string
  currentStep: AssessmentStep
  language: 'en' | 'ar'
  responses: QuestionResponse[]
  selectedFormat: 'scenarios' | 'traits' | 'sais' | null
  progress: number
  isComplete: boolean
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
  setSelectedFormat: (format: 'scenarios' | 'traits' | 'sais') => void
  updateProgress: (progress: number) => void
  completeAssessment: () => void
  resetAssessment: () => void
  
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
          set((state) => ({
            assessment: {
              ...state.assessment,
              responses: [...state.assessment.responses, response]
            }
          })),
          
        setSelectedFormat: (selectedFormat) =>
          set((state) => ({
            assessment: { ...state.assessment, selectedFormat }
          })),
          
        updateProgress: (progress) =>
          set((state) => ({
            assessment: { ...state.assessment, progress }
          })),
          
        completeAssessment: () =>
          set((state) => ({
            assessment: { ...state.assessment, isComplete: true, currentStep: 'results' }
          })),
          
        resetAssessment: () =>
          set((state) => ({
            assessment: initialAssessmentState
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

