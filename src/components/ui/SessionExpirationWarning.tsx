'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

interface SessionExpirationWarningProps {
  isVisible: boolean
  timeRemaining: number
  onExtendSession: () => void
  onDismiss: () => void
  onExpired: () => void
}

export function SessionExpirationWarning({
  isVisible,
  timeRemaining,
  onExtendSession,
  onDismiss,
  onExpired
}: SessionExpirationWarningProps) {
  const { t } = useTranslation()
  const [localTimeRemaining, setLocalTimeRemaining] = useState(timeRemaining)

  useEffect(() => {
    setLocalTimeRemaining(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setLocalTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1000)
        if (newTime === 0) {
          onExpired()
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, onExpired])

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getWarningColor = (milliseconds: number): string => {
    const minutes = milliseconds / 60000
    if (minutes <= 2) return 'bg-red-500'
    if (minutes <= 5) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getWarningIcon = (milliseconds: number): string => {
    const minutes = milliseconds / 60000
    if (minutes <= 2) return '🚨'
    if (minutes <= 5) return '⚠️'
    return '⏰'
  }

  if (!isVisible || localTimeRemaining <= 0) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className={`${getWarningColor(localTimeRemaining)} text-white rounded-lg shadow-lg p-4 animate-pulse`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">{getWarningIcon(localTimeRemaining)}</div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              {t('sessionExpiration.warning.title')}
            </h3>
            
            <p className="text-sm opacity-90 mb-3">
              {t('sessionExpiration.warning.message')}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs opacity-75">
                {t('sessionExpiration.timeRemaining')}:
              </span>
              <span className="font-mono font-bold text-lg">
                {formatTime(localTimeRemaining)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={onExtendSession}
                size="sm"
                className="bg-white text-gray-800 hover:bg-gray-100 flex-1"
              >
                {t('sessionExpiration.extend')}
              </Button>
              
              <Button
                onClick={onDismiss}
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-800"
              >
                {t('sessionExpiration.dismiss')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SessionExpiredModalProps {
  isVisible: boolean
  onRestart: () => void
  onSaveProgress?: () => void
}

export function SessionExpiredModal({
  isVisible,
  onRestart,
  onSaveProgress
}: SessionExpiredModalProps) {
  const { t } = useTranslation()

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-red-500 text-4xl mb-4">⏱️</div>
          <h3 className="text-xl font-semibold mb-2">
            {t('sessionExpiration.expired.title')}
          </h3>
          <p className="text-gray-600">
            {t('sessionExpiration.expired.message')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {onSaveProgress && (
            <Button
              onClick={onSaveProgress}
              variant="secondary"
              className="w-full"
            >
              {t('sessionExpiration.expired.saveProgress')}
            </Button>
          )}
          
          <Button
            onClick={onRestart}
            variant="primary"
            className="w-full"
          >
            {t('sessionExpiration.expired.startNew')}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t('sessionExpiration.expired.note')}
        </p>
      </div>
    </div>
  )
}