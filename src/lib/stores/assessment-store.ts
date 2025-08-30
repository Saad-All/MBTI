import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { QuestionResponse } from '@/lib/types'
import { storageService } from '@/lib/services/StorageService'
import { SessionService } from '@/lib/services/SessionService'
import { CORE_QUESTIONS_COUNT, FORMAT_QUESTIONS, TOTAL_QUESTIONS, QUESTION_POOLS, PROGRESS_MILESTONES } from '@/lib/constants/assessment'

export type AssessmentStep = 'welcome' | 'core-questions' | 'interim-results' | 'format-selection' | 'questions' | 'results' | 'coaching'

export interface AssessmentState {
  sessionId: string
  currentStep: AssessmentStep
  language: 'en' | 'ar'
  responses: QuestionResponse[]
  coreResponses: QuestionResponse[]
  extendedResponses: QuestionResponse[]
  selectedFormat: 'scenarios' | 'traits' | 'sais' | null
  progress: number
  isComplete: boolean
  startTime?: Date
  completionTime?: Date
  calculatedType?: string
  confidence?: number
  interimResults?: {
    mbtiType: string
    confidence: number
    insights: string[]
    disclaimer: string
  }
  // Format-specific tracking
  formatProgress?: {
    totalQuestions: number
    currentQuestionIndex: number
    completedQuestions: number
    questionPool: string
  }
  // Final calculation results
  results?: {
    mbtiType: string
    scores: {
      'E/I': number
      'S/N': number
      'T/F': number
      'J/P': number
    }
    confidence: number
    methodology: string
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
  setCoreResponses: (responses: QuestionResponse[]) => void
  setExtendedResponses: (responses: QuestionResponse[]) => void
  setSelectedFormat: (format: 'scenarios' | 'traits' | 'sais') => void
  updateProgress: (progress: number) => void
  setProgress: (progress: number) => void
  calculateFormatSpecificProgress: () => number
  updateFormatProgress: (currentIndex: number) => void
  completeAssessment: () => void
  resetAssessment: () => void
  setInterimResults: (results: AssessmentState['interimResults']) => void
  setResults: (results: AssessmentState['results']) => void
  setStartTime: (time: Date) => void
  setCompletionTime: (time: Date) => void
  setCalculatedType: (type: string) => void
  setConfidence: (confidence: number) => void
  persistState: () => void
  restoreFromSession: (sessionId: string) => boolean
  
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
  coreResponses: [],
  extendedResponses: [],
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
      (set, get) => ({
        assessment: initialAssessmentState,
        ui: initialUIState,
        
        // Assessment actions
        setSessionId: (sessionId) => {
          // Initialize session with SessionService
          SessionService.initializeSession(sessionId, 'core');
          
          set((state) => ({
            assessment: { ...state.assessment, sessionId }
          }));
        },
          
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
            
            // Also update core/extended responses based on type
            let newCoreResponses = [...state.assessment.coreResponses]
            let newExtendedResponses = [...state.assessment.extendedResponses]
            
            if (response.questionType === 'core') {
              const coreIndex = newCoreResponses.findIndex(r => r.questionId === response.questionId)
              if (coreIndex >= 0) {
                newCoreResponses[coreIndex] = response
              } else {
                newCoreResponses.push(response)
              }
            } else {
              const extendedIndex = newExtendedResponses.findIndex(r => r.questionId === response.questionId)
              if (extendedIndex >= 0) {
                newExtendedResponses[extendedIndex] = response
              } else {
                newExtendedResponses.push(response)
              }
            }
            
            const updatedAssessment = {
              ...state.assessment,
              responses: newResponses,
              coreResponses: newCoreResponses,
              extendedResponses: newExtendedResponses
            }
            
            // Auto-persist after each response
            setTimeout(() => {
              get().persistState()
            }, 0)
            
            return {
              assessment: updatedAssessment
            }
          }),
          
        setResponses: (responses) =>
          set((state) => {
            // Separate core and extended responses
            const coreResponses = responses.filter(r => r.questionType === 'core')
            const extendedResponses = responses.filter(r => r.questionType === 'extended')
            
            return {
              assessment: { 
                ...state.assessment, 
                responses, 
                coreResponses, 
                extendedResponses 
              }
            }
          }),

        setCoreResponses: (coreResponses) =>
          set((state) => ({
            assessment: { ...state.assessment, coreResponses }
          })),

        setExtendedResponses: (extendedResponses) =>
          set((state) => ({
            assessment: { ...state.assessment, extendedResponses }
          })),
          
        setSelectedFormat: (selectedFormat) => {
          const state = get();
          
          // Transition to extended phase when format is selected
          if (state.assessment.sessionId) {
            SessionService.transitionToExtendedPhase(state.assessment.sessionId);
          }
          
          // Initialize format-specific progress tracking
          const formatProgress = {
            totalQuestions: TOTAL_QUESTIONS[selectedFormat],
            currentQuestionIndex: 0,
            completedQuestions: CORE_QUESTIONS_COUNT, // Core questions already completed
            questionPool: QUESTION_POOLS[selectedFormat]
          };
          
          set((state) => ({
            assessment: { 
              ...state.assessment, 
              selectedFormat,
              formatProgress,
              progress: PROGRESS_MILESTONES.formatSelected // Set to 40% after format selection
            }
          }));
        },
          
        updateProgress: (progress) =>
          set((state) => ({
            assessment: { ...state.assessment, progress }
          })),
          
        setProgress: (progress) =>
          set((state) => ({
            assessment: { ...state.assessment, progress }
          })),
          
        calculateFormatSpecificProgress: () => {
          const state = get();
          const { selectedFormat, formatProgress, coreResponses, extendedResponses } = state.assessment;
          
          if (!selectedFormat || !formatProgress) {
            // Core assessment progress only
            return (coreResponses.length / CORE_QUESTIONS_COUNT) * PROGRESS_MILESTONES.coreComplete;
          }
          
          // Calculate total completed questions (core + extended)
          const totalCompleted = coreResponses.length + extendedResponses.length;
          const totalQuestions = formatProgress.totalQuestions;
          
          // Calculate percentage (0-100)
          return Math.min(100, Math.round((totalCompleted / totalQuestions) * 100));
        },
        
        updateFormatProgress: (currentIndex) => {
          const state = get();
          const { formatProgress } = state.assessment;
          
          if (!formatProgress) return;
          
          const updatedFormatProgress = {
            ...formatProgress,
            currentQuestionIndex: currentIndex,
            completedQuestions: CORE_QUESTIONS_COUNT + currentIndex
          };
          
          // Calculate and update progress automatically
          const newProgress = get().calculateFormatSpecificProgress();
          
          set((state) => ({
            assessment: {
              ...state.assessment,
              formatProgress: updatedFormatProgress,
              progress: newProgress
            }
          }));
        },
          
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

        setResults: (results) =>
          set((state) => ({
            assessment: { ...state.assessment, results }
          })),

        setStartTime: (startTime) =>
          set((state) => ({
            assessment: { ...state.assessment, startTime }
          })),

        setCompletionTime: (completionTime) =>
          set((state) => ({
            assessment: { ...state.assessment, completionTime }
          })),

        setCalculatedType: (calculatedType) =>
          set((state) => ({
            assessment: { ...state.assessment, calculatedType }
          })),

        setConfidence: (confidence) =>
          set((state) => ({
            assessment: { ...state.assessment, confidence }
          })),

        persistState: () => {
          const state = get()
          const sessionData = {
            sessionId: state.assessment.sessionId,
            language: state.assessment.language,
            currentStep: state.assessment.currentStep,
            startTime: state.assessment.startTime || new Date(),
            completionTime: state.assessment.completionTime,
            selectedFormat: state.assessment.selectedFormat,
            coreResponses: state.assessment.coreResponses,
            extendedResponses: state.assessment.extendedResponses,
            calculatedType: state.assessment.calculatedType,
            confidence: state.assessment.confidence,
            progress: state.assessment.progress,
            isComplete: state.assessment.isComplete,
            formatProgress: state.assessment.formatProgress
          }
          
          // Update session activity when persisting state
          SessionService.updateActivity();
          
          storageService.setItem(state.assessment.sessionId, sessionData)
        },

        restoreFromSession: (sessionId: string) => {
          try {
            const result = storageService.getItem(sessionId)
            
            if (result.success && result.data) {
              const sessionData = result.data
              
              set((state) => ({
                assessment: {
                  ...state.assessment,
                  sessionId: sessionData.sessionId,
                  language: sessionData.language,
                  currentStep: sessionData.currentStep,
                  startTime: sessionData.startTime ? new Date(sessionData.startTime) : undefined,
                  completionTime: sessionData.completionTime ? new Date(sessionData.completionTime) : undefined,
                  selectedFormat: sessionData.selectedFormat,
                  coreResponses: sessionData.coreResponses || [],
                  extendedResponses: sessionData.extendedResponses || [],
                  responses: [...(sessionData.coreResponses || []), ...(sessionData.extendedResponses || [])],
                  calculatedType: sessionData.calculatedType,
                  confidence: sessionData.confidence,
                  progress: sessionData.progress,
                  isComplete: sessionData.isComplete,
                  formatProgress: sessionData.formatProgress
                },
                ui: {
                  ...state.ui,
                  direction: sessionData.language === 'ar' ? 'rtl' : 'ltr'
                }
              }))
              
              return true
            }
            
            return false
          } catch (error) {
            console.error('Failed to restore session:', error)
            return false
          }
        },
          
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
    { name: 'MBTI App Store' }
  )
)

// Selector hooks for better performance
export const useAssessmentStore = () => useAppStore((state) => ({
  sessionId: state.assessment.sessionId,
  currentStep: state.assessment.currentStep,
  language: state.assessment.language,
  responses: state.assessment.responses,
  coreResponses: state.assessment.coreResponses,
  extendedResponses: state.assessment.extendedResponses,
  selectedFormat: state.assessment.selectedFormat,
  progress: state.assessment.progress,
  isComplete: state.assessment.isComplete,
  startTime: state.assessment.startTime,
  completionTime: state.assessment.completionTime,
  calculatedType: state.assessment.calculatedType,
  confidence: state.assessment.confidence,
  interimResults: state.assessment.interimResults,
  formatProgress: state.assessment.formatProgress,
  results: state.assessment.results,
  setSessionId: state.setSessionId,
  setCurrentStep: state.setCurrentStep,
  setLanguage: state.setLanguage,
  addResponse: state.addResponse,
  setResponses: state.setResponses,
  setCoreResponses: state.setCoreResponses,
  setExtendedResponses: state.setExtendedResponses,
  setSelectedFormat: state.setSelectedFormat,
  updateProgress: state.updateProgress,
  setProgress: state.setProgress,
  calculateFormatSpecificProgress: state.calculateFormatSpecificProgress,
  updateFormatProgress: state.updateFormatProgress,
  completeAssessment: state.completeAssessment,
  resetAssessment: state.resetAssessment,
  setInterimResults: state.setInterimResults,
  setResults: state.setResults,
  setStartTime: state.setStartTime,
  setCompletionTime: state.setCompletionTime,
  setCalculatedType: state.setCalculatedType,
  setConfidence: state.setConfidence,
  persistState: state.persistState,
  restoreFromSession: state.restoreFromSession,
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

