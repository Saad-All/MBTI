'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { storageService } from '@/lib/services/StorageService'
import { useAssessmentStore } from '@/lib/stores/assessment-store'

interface RecoveryDialogProps {
  sessionId: string | null
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  onRestart: () => void
}

interface SessionRecoveryData {
  sessionData: any
  lastSaved: Date | null
  isExpired: boolean
  layer?: string
}

export function RecoveryDialog({ 
  sessionId, 
  isOpen, 
  onClose, 
  onContinue, 
  onRestart 
}: RecoveryDialogProps) {
  const { t } = useTranslation()
  const { restoreFromSession, setSessionId } = useAssessmentStore()
  const [recoveryData, setRecoveryData] = useState<SessionRecoveryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkForExistingSession = (sessionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check localStorage/sessionStorage for existing session
      const result = storageService.getItem(sessionId)
      
      if (result.success && result.data) {
        setRecoveryData({
          sessionData: result.data,
          lastSaved: new Date(),
          isExpired: false,
          layer: result.layer || 'localStorage'
        })
      } else {
        // No session found
        setRecoveryData(null)
        onClose() // Close dialog if no session to recover
      }
    } catch (error) {
      console.error('Recovery check failed:', error)
      setError('Failed to check for existing session')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && sessionId) {
      checkForExistingSession(sessionId)
    }
  }, [isOpen, sessionId, checkForExistingSession])

  const handleContinue = () => {
    if (!sessionId || !recoveryData) return

    setIsLoading(true)
    try {
      const restored = restoreFromSession(sessionId)
      
      if (restored) {
        onContinue()
      } else {
        setError('Failed to restore session data')
      }
    } catch (error) {
      console.error('Failed to restore session:', error)
      setError('Failed to restore session data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    if (sessionId) {
      // Clean up old session data
      storageService.removeItem(sessionId)
      
      // Generate new session ID
      const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)
    }
    
    onRestart()
  }

  if (!isOpen) return null

  const formatLastSaved = (date: Date | null) => {
    if (!date) return t('common.unknown')
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    
    if (diffMinutes < 1) return t('recovery.justNow')
    if (diffMinutes < 60) return t('recovery.minutesAgo', { count: diffMinutes })
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return t('recovery.hoursAgo', { count: diffHours })
    
    return date.toLocaleDateString()
  }

  const getProgressPercentage = () => {
    if (!recoveryData?.sessionData) return 0
    return Math.round(recoveryData.sessionData.progress || 0)
  }

  const getStorageIcon = (layer?: string) => {
    switch (layer) {
      case 'localStorage': return '💾'
      case 'sessionStorage': return '🔄'
      case 'server': return '☁️'
      case 'memory': return '🧠'
      default: return '💾'
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>{t('recovery.checking')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">{t('recovery.error')}</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onClose} variant="primary">
              {t('common.close')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!recoveryData) {
    return null
  }

  if (recoveryData.isExpired) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-yellow-500 text-3xl mb-4">⏰</div>
            <h3 className="text-lg font-semibold mb-2">{t('recovery.expired.title')}</h3>
            <p className="text-gray-600 mb-4">{t('recovery.expired.message')}</p>
            <p className="text-sm text-gray-500 mb-6">
              {t('recovery.lastSaved')}: {formatLastSaved(recoveryData.lastSaved)}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRestart} variant="primary">
                {t('recovery.startFresh')}
              </Button>
              <Button onClick={onClose} variant="secondary">
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-blue-500 text-3xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold mb-2">{t('recovery.foundSession')}</h3>
          <p className="text-gray-600">{t('recovery.description')}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{t('recovery.progress')}:</span>
            <span className="text-blue-600">{getProgressPercentage()}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('recovery.lastSaved')}:</span>
            <span>{formatLastSaved(recoveryData.lastSaved)}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('recovery.savedTo')}:</span>
            <span>
              {getStorageIcon(recoveryData.layer)} {recoveryData.layer}
            </span>
          </div>

          {recoveryData.sessionData.selectedFormat && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t('recovery.format')}:</span>
              <span className="capitalize">{recoveryData.sessionData.selectedFormat}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleContinue} 
            variant="primary"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? t('recovery.restoring') : t('recovery.continue')}
          </Button>
          
          <Button 
            onClick={handleRestart} 
            variant="secondary"
            disabled={isLoading}
            className="w-full"
          >
            {t('recovery.startFresh')}
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            {t('common.cancel')}
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          {t('recovery.note')}
        </div>
      </div>
    </div>
  )
}