// Session expiration utilities
export const SESSION_TIMEOUT = 3 * 60 * 60 * 1000 // 3 hours in milliseconds

export interface SessionExpiration {
  startTime: Date
  expiresAt: Date
  isExpired: boolean
  timeRemaining: number // in milliseconds
  warningTriggered: boolean
}

export class SessionExpirationManager {
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private warningCallbacks: Map<string, () => void> = new Map()
  private expirationCallbacks: Map<string, () => void> = new Map()

  /**
   * Calculate session expiration details
   */
  calculateExpiration(startTime: Date): SessionExpiration {
    const now = new Date()
    const expiresAt = new Date(startTime.getTime() + SESSION_TIMEOUT)
    const timeRemaining = Math.max(0, expiresAt.getTime() - now.getTime())
    const isExpired = timeRemaining === 0
    
    // Warning should be triggered 10 minutes before expiration
    const warningTime = 10 * 60 * 1000
    const warningTriggered = timeRemaining <= warningTime && timeRemaining > 0

    return {
      startTime,
      expiresAt,
      isExpired,
      timeRemaining,
      warningTriggered
    }
  }

  /**
   * Check if a session is expired
   */
  isSessionExpired(startTime: Date | string): boolean {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime
    const expiration = this.calculateExpiration(start)
    return expiration.isExpired
  }

  /**
   * Register session expiration monitoring
   */
  monitorSession(
    sessionId: string,
    startTime: Date,
    onWarning?: () => void,
    onExpiration?: () => void
  ): void {
    // Clear existing timers for this session
    this.clearSessionMonitoring(sessionId)

    const expiration = this.calculateExpiration(startTime)
    
    if (expiration.isExpired) {
      // Session already expired
      if (onExpiration) onExpiration()
      return
    }

    // Store callbacks
    if (onWarning) this.warningCallbacks.set(sessionId, onWarning)
    if (onExpiration) this.expirationCallbacks.set(sessionId, onExpiration)

    // Set warning timer (10 minutes before expiration)
    const warningTime = Math.max(0, expiration.timeRemaining - (10 * 60 * 1000))
    if (warningTime > 0 && onWarning) {
      const warningTimer = setTimeout(() => {
        onWarning()
        this.timers.delete(`${sessionId}-warning`)
      }, warningTime)
      
      this.timers.set(`${sessionId}-warning`, warningTimer)
    }

    // Set expiration timer
    if (expiration.timeRemaining > 0 && onExpiration) {
      const expirationTimer = setTimeout(() => {
        onExpiration()
        this.clearSessionMonitoring(sessionId)
      }, expiration.timeRemaining)
      
      this.timers.set(`${sessionId}-expiration`, expirationTimer)
    }
  }

  /**
   * Clear session monitoring
   */
  clearSessionMonitoring(sessionId: string): void {
    // Clear warning timer
    const warningTimer = this.timers.get(`${sessionId}-warning`)
    if (warningTimer) {
      clearTimeout(warningTimer)
      this.timers.delete(`${sessionId}-warning`)
    }

    // Clear expiration timer
    const expirationTimer = this.timers.get(`${sessionId}-expiration`)
    if (expirationTimer) {
      clearTimeout(expirationTimer)
      this.timers.delete(`${sessionId}-expiration`)
    }

    // Clear callbacks
    this.warningCallbacks.delete(sessionId)
    this.expirationCallbacks.delete(sessionId)
  }

  /**
   * Extend session expiration (restart the timer)
   */
  extendSession(sessionId: string, newStartTime?: Date): void {
    const warningCallback = this.warningCallbacks.get(sessionId)
    const expirationCallback = this.expirationCallbacks.get(sessionId)
    
    if (warningCallback || expirationCallback) {
      const startTime = newStartTime || new Date()
      this.monitorSession(sessionId, startTime, warningCallback, expirationCallback)
    }
  }

  /**
   * Get time remaining for session
   */
  getTimeRemaining(sessionId: string, startTime: Date): number {
    const expiration = this.calculateExpiration(startTime)
    return expiration.timeRemaining
  }

  /**
   * Format time remaining in human-readable format
   */
  formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) return 'Expired'

    const hours = Math.floor(milliseconds / (60 * 60 * 1000))
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  /**
   * Clean up all timers
   */
  cleanup(): void {
    for (const timer of Array.from(this.timers.values())) {
      clearTimeout(timer)
    }
    this.timers.clear()
    this.warningCallbacks.clear()
    this.expirationCallbacks.clear()
  }
}

// Singleton instance
export const sessionExpirationManager = new SessionExpirationManager()

/**
 * React hook for session expiration
 */
import { useState, useEffect, useCallback } from 'react'

export function useSessionExpiration(sessionId: string, startTime: Date | null) {
  const [expiration, setExpiration] = useState<SessionExpiration | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  const updateExpiration = useCallback(() => {
    if (!startTime) {
      setExpiration(null)
      return
    }

    const exp = sessionExpirationManager.calculateExpiration(startTime)
    setExpiration(exp)
    setIsExpired(exp.isExpired)
    
    if (exp.warningTriggered && !showWarning) {
      setShowWarning(true)
    }
  }, [startTime, showWarning])

  // Set up monitoring
  useEffect(() => {
    if (!sessionId || !startTime) return

    const onWarning = () => {
      setShowWarning(true)
    }

    const onExpiration = () => {
      setIsExpired(true)
      updateExpiration()
    }

    sessionExpirationManager.monitorSession(sessionId, startTime, onWarning, onExpiration)

    return () => {
      sessionExpirationManager.clearSessionMonitoring(sessionId)
    }
  }, [sessionId, startTime, updateExpiration])

  // Update expiration info every 30 seconds
  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(updateExpiration, 30000)
    updateExpiration() // Initial update

    return () => clearInterval(interval)
  }, [startTime, updateExpiration])

  const extendSession = useCallback(() => {
    if (!sessionId) return
    
    const newStartTime = new Date()
    sessionExpirationManager.extendSession(sessionId, newStartTime)
    setShowWarning(false)
    setIsExpired(false)
    updateExpiration()
  }, [sessionId, updateExpiration])

  const dismissWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  return {
    expiration,
    showWarning,
    isExpired,
    extendSession,
    dismissWarning,
    timeRemaining: expiration?.timeRemaining || 0,
    timeRemainingFormatted: expiration 
      ? sessionExpirationManager.formatTimeRemaining(expiration.timeRemaining)
      : 'Unknown'
  }
}

/**
 * Server-side session cleanup utility
 */
export function cleanupExpiredSessions<T extends { expiresAt: Date }>(
  sessions: Map<string, T>
): number {
  const now = new Date()
  let cleanedCount = 0

  for (const [sessionId, data] of Array.from(sessions.entries())) {
    if (data.expiresAt < now) {
      sessions.delete(sessionId)
      cleanedCount++
    }
  }

  return cleanedCount
}

/**
 * Storage cleanup utility for expired client sessions
 */
export async function cleanupExpiredClientSessions(): Promise<number> {
  if (typeof window === 'undefined') return 0

  let cleanedCount = 0

  try {
    // Clean localStorage
    const localKeys = Object.keys(localStorage).filter(key => key.startsWith('session-'))
    
    for (const key of localKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        if (data.startTime) {
          const startTime = new Date(data.startTime)
          if (sessionExpirationManager.isSessionExpired(startTime)) {
            localStorage.removeItem(key)
            cleanedCount++
          }
        }
      } catch {
        // Invalid data, remove it
        localStorage.removeItem(key)
        cleanedCount++
      }
    }

    // Clean sessionStorage
    const sessionData = sessionStorage.getItem('mbti-assessment-session')
    if (sessionData) {
      try {
        const data = JSON.parse(sessionData)
        if (data.startTime && sessionExpirationManager.isSessionExpired(new Date(data.startTime))) {
          sessionStorage.removeItem('mbti-assessment-session')
          cleanedCount++
        }
      } catch {
        // Invalid data, remove it
        sessionStorage.removeItem('mbti-assessment-session')
        cleanedCount++
      }
    }
  } catch (error) {
    console.error('Failed to cleanup expired client sessions:', error)
  }

  return cleanedCount
}