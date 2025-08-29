'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAssessmentStore } from '@/lib/stores/assessment-store'
import { storageService } from '@/lib/services/StorageService'

export interface PersistenceState {
  isRestoring: boolean
  hasRestoredSession: boolean
  lastSaved: Date | null
  storageHealth: {
    localStorage: boolean
    sessionStorage: boolean
  }
  errors: string[]
}

export function useAssessmentPersistence() {
  const assessmentState = useAssessmentStore()
  const lastSaveRef = useRef<Date | null>(null)
  const isRestoringRef = useRef(false)
  
  const [persistenceState, setPersistenceState] = useState<PersistenceState>({
    isRestoring: false,
    hasRestoredSession: false,
    lastSaved: null,
    storageHealth: {
      localStorage: false,
      sessionStorage: false
    },
    errors: []
  })

  // Check storage health on mount
  useEffect(() => {
    function checkHealth() {
      try {
        const health = storageService.checkStorageHealth()
        setPersistenceState(prev => ({
          ...prev,
          storageHealth: health
        }))
      } catch (error) {
        console.error('Storage health check failed:', error)
        setPersistenceState(prev => ({
          ...prev,
          errors: [...prev.errors, 'Storage health check failed']
        }))
      }
    }

    checkHealth()
  }, [])

  // Auto-persist state changes with debouncing
  const persistState = useCallback(() => {
    if (isRestoringRef.current || !assessmentState.sessionId) return
    
    try {
      assessmentState.persistState()
      lastSaveRef.current = new Date()
      setPersistenceState(prev => ({
        ...prev,
        lastSaved: lastSaveRef.current,
        errors: prev.errors.filter(e => !e.includes('save'))
      }))
    } catch (error) {
      console.error('Auto-persist failed:', error)
      setPersistenceState(prev => ({
        ...prev,
        errors: [...prev.errors, 'Auto-save failed']
      }))
    }
  }, [assessmentState])

  // Debounced auto-save effect
  useEffect(() => {
    if (isRestoringRef.current) return
    
    const timeoutId = setTimeout(() => {
      persistState()
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [
    assessmentState.sessionId,
    assessmentState.currentStep,
    assessmentState.language,
    assessmentState.responses,
    assessmentState.selectedFormat,
    assessmentState.progress,
    assessmentState.isComplete,
    assessmentState.startTime,
    assessmentState.completionTime,
    assessmentState.calculatedType,
    assessmentState.confidence,
    persistState
  ])

  // Recovery helper function
  const attemptRecovery = useCallback((sessionId?: string): {
    success: boolean
    hasSession: boolean
    isExpired: boolean
    error?: string
  } => {
    try {
      setPersistenceState(prev => ({ ...prev, isRestoring: true }))
      isRestoringRef.current = true

      // Try to recover from localStorage/sessionStorage
      const recoverySessionId = sessionId || generateSessionId()
      const result = storageService.getItem(recoverySessionId)
      
      if (result.success && result.data) {
        // Restore the session
        const restored = assessmentState.restoreFromSession(recoverySessionId)
        
        if (restored) {
          setPersistenceState(prev => ({
            ...prev,
            hasRestoredSession: true,
            errors: prev.errors.filter(e => !e.includes('recovery'))
          }))
          
          return {
            success: true,
            hasSession: true,
            isExpired: false
          }
        }
      }

      return {
        success: false,
        hasSession: false,
        isExpired: false
      }
    } catch (error) {
      console.error('Recovery attempt failed:', error)
      setPersistenceState(prev => ({
        ...prev,
        errors: [...prev.errors, 'Recovery failed']
      }))
      
      return {
        success: false,
        hasSession: false,
        isExpired: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    } finally {
      setPersistenceState(prev => ({ ...prev, isRestoring: false }))
      isRestoringRef.current = false
    }
  }, [assessmentState])

  // Auto-recovery on mount
  useEffect(() => {
    function autoRecover() {
      if (assessmentState.sessionId) return // Already has session

      // Try to recover existing session
      const existingSessionId = getExistingSessionId()
      if (existingSessionId) {
        attemptRecovery(existingSessionId)
      } else {
        // No existing session, start fresh
        const newSessionId = generateSessionId()
        assessmentState.setSessionId(newSessionId)
        assessmentState.setStartTime(new Date())
      }
    }

    autoRecover()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Manual recovery function for RecoveryDialog
  const recoverSession = useCallback((sessionId: string) => {
    return attemptRecovery(sessionId)
  }, [attemptRecovery])

  // Clear session function
  const clearSession = useCallback((sessionId?: string) => {
    const idToRemove = sessionId || assessmentState.sessionId
    if (idToRemove) {
      try {
        storageService.removeItem(idToRemove)
        setPersistenceState(prev => ({
          ...prev,
          hasRestoredSession: false,
          lastSaved: null,
          errors: prev.errors.filter(e => !e.includes('clear'))
        }))
      } catch (error) {
        console.error('Failed to clear session:', error)
        setPersistenceState(prev => ({
          ...prev,
          errors: [...prev.errors, 'Failed to clear session']
        }))
      }
    }
  }, [assessmentState.sessionId])

  // Force save function
  const forceSave = useCallback(() => {
    persistState()
  }, [persistState])

  return {
    ...assessmentState,
    persistence: {
      ...persistenceState,
      recoverSession,
      clearSession,
      forceSave,
      checkStorageHealth: () => {
        const health = storageService.checkStorageHealth()
        setPersistenceState(prev => ({ ...prev, storageHealth: health }))
        return health
      }
    }
  }
}

// Helper functions
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getExistingSessionId(): string | null {
  try {
    // Check sessionStorage first (legacy)
    const legacySession = sessionStorage.getItem('mbti-assessment-session')
    if (legacySession) {
      const parsed = JSON.parse(legacySession)
      return parsed.sessionId || null
    }

    // Check localStorage
    const keys = Object.keys(localStorage)
    const sessionKey = keys.find(key => key.startsWith('session-'))
    return sessionKey || null
  } catch (error) {
    console.error('Failed to get existing session ID:', error)
    return null
  }
}

// Advanced recovery hook for specific use cases
export function useSessionRecovery() {
  const [availableSessions, setAvailableSessions] = useState<string[]>([])
  
  const findAvailableSessions = useCallback(() => {
    try {
      const sessions: string[] = []
      
      // Check localStorage for session keys
      const localKeys = Object.keys(localStorage).filter(key => key.startsWith('session-'))
      sessions.push(...localKeys)
      
      // Check sessionStorage for legacy sessions
      const legacySession = sessionStorage.getItem('mbti-assessment-session')
      if (legacySession) {
        const parsed = JSON.parse(legacySession)
        if (parsed.sessionId && !sessions.includes(parsed.sessionId)) {
          sessions.push(parsed.sessionId)
        }
      }
      
      setAvailableSessions(sessions)
      return sessions
    } catch (error) {
      console.error('Failed to find available sessions:', error)
      return []
    }
  }, [])
  
  const validateSession = useCallback((sessionId: string): {
    isValid: boolean
    isExpired: boolean
    progress: number
    lastSaved?: Date
  } => {
    try {
      const result = storageService.getItem(sessionId)
      if (!result.success || !result.data) {
        return { isValid: false, isExpired: false, progress: 0 }
      }
      
      return {
        isValid: true,
        isExpired: false, // No expiration for simplified version
        progress: result.data.progress || 0,
        lastSaved: result.data.timestamp ? new Date(result.data.timestamp) : undefined
      }
    } catch (error) {
      console.error('Session validation failed:', error)
      return { isValid: false, isExpired: false, progress: 0 }
    }
  }, [])
  
  return {
    availableSessions,
    findAvailableSessions,
    validateSession
  }
}