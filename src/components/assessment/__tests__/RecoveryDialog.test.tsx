/**
 * Tests for Enhanced Recovery Dialog with exact position continuation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecoveryDialog } from '../RecoveryDialog';
import { storageService } from '@/lib/services/StorageService';
import { SessionService } from '@/lib/services/SessionService';
import { useAssessmentStore } from '@/lib/stores/assessment-store';

// Mock dependencies
jest.mock('@/lib/services/StorageService');
jest.mock('@/lib/services/SessionService');
jest.mock('@/lib/stores/assessment-store');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      if (params) {
        return `${key} ${JSON.stringify(params)}`;
      }
      return key;
    }
  })
}));

describe('RecoveryDialog - Enhanced Recovery', () => {
  const mockOnClose = jest.fn();
  const mockOnContinue = jest.fn();
  const mockOnRestart = jest.fn();
  const mockRestoreFromSession = jest.fn();
  const mockSetSessionId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup store mock
    (useAssessmentStore as jest.Mock).mockReturnValue({
      restoreFromSession: mockRestoreFromSession,
      setSessionId: mockSetSessionId
    });
  });

  describe('Exact Position Recovery', () => {
    it('should display exact position for core assessment recovery', async () => {
      const sessionData = {
        sessionId: 'test-session-123',
        currentStep: 'core-questions',
        coreResponses: [
          { questionId: '1' },
          { questionId: '2' }
        ],
        extendedResponses: [],
        progress: 50,
        lastModified: new Date().toISOString()
      };

      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: sessionData,
        layer: 'localStorage'
      });

      (SessionService.getSessionData as jest.Mock).mockReturnValue({
        sessionId: 'test-session-123',
        phase: 'core',
        expiresAt: Date.now() + 10000
      });

      (SessionService.isSessionExpired as jest.Mock).mockReturnValue(false);

      render(
        <RecoveryDialog
          sessionId="test-session-123"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('recovery.currentStep:')).toBeInTheDocument();
        expect(screen.getByText('Core Assessment')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Question 3 (index 2 + 1)
        expect(screen.getByText('2')).toBeInTheDocument(); // 2 questions completed
      });
    });

    it('should display exact position for extended SAIS assessment', async () => {
      const sessionData = {
        sessionId: 'test-session-456',
        currentStep: 'questions',
        selectedFormat: 'sais',
        formatProgress: {
          totalQuestions: 16,
          currentQuestionIndex: 5,
          completedQuestions: 9,
          questionPool: 'sais-methodology'
        },
        coreResponses: new Array(4).fill({}),
        extendedResponses: new Array(5).fill({}),
        progress: 56.25,
        lastModified: new Date().toISOString()
      };

      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: sessionData,
        layer: 'localStorage'
      });

      (SessionService.getSessionData as jest.Mock).mockReturnValue({
        sessionId: 'test-session-456',
        phase: 'extended',
        expiresAt: Date.now() + (48 * 60 * 60 * 1000)
      });

      (SessionService.isSessionExpired as jest.Mock).mockReturnValue(false);
      (SessionService.getSessionSummary as jest.Mock).mockReturnValue({
        isActive: true,
        phase: 'extended',
        timeRemaining: '47h 30m',
        expiresAt: new Date()
      });

      render(
        <RecoveryDialog
          sessionId="test-session-456"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Extended Assessment')).toBeInTheDocument();
        expect(screen.getByText('recovery.format:')).toBeInTheDocument();
        expect(screen.getByText('sais')).toBeInTheDocument();
        expect(screen.getByText('(sais-methodology)')).toBeInTheDocument();
        expect(screen.getByText('9')).toBeInTheDocument(); // 9 questions completed
        expect(screen.getByText(/recovery.extendedSession.*47h 30m/)).toBeInTheDocument();
      });
    });

    it('should show format selection state correctly', async () => {
      const sessionData = {
        sessionId: 'test-session-789',
        currentStep: 'format-selection',
        coreResponses: new Array(4).fill({}),
        extendedResponses: [],
        progress: 40
      };

      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: sessionData,
        layer: 'localStorage'
      });

      (SessionService.getSessionData as jest.Mock).mockReturnValue({
        sessionId: 'test-session-789',
        phase: 'core'
      });

      render(
        <RecoveryDialog
          sessionId="test-session-789"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Format Selection')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument(); // 4 core questions completed
      });
    });
  });

  describe('Session Phase Detection', () => {
    it('should show extended session warning for 48-hour sessions', async () => {
      const sessionData = {
        sessionId: 'test-extended',
        currentStep: 'questions',
        selectedFormat: 'traits',
        formatProgress: {
          totalQuestions: 20,
          currentQuestionIndex: 3
        },
        coreResponses: new Array(4).fill({}),
        extendedResponses: new Array(3).fill({})
      };

      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: sessionData,
        layer: 'localStorage'
      });

      (SessionService.getSessionData as jest.Mock).mockReturnValue({
        phase: 'extended'
      });
      
      (SessionService.getSessionSummary as jest.Mock).mockReturnValue({
        timeRemaining: '45h 15m'
      });

      render(
        <RecoveryDialog
          sessionId="test-extended"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/recovery.extendedSession.*45h 15m/)).toBeInTheDocument();
        expect(screen.getByText('recovery.extendedNote')).toBeInTheDocument();
      });
    });

    it('should handle expired extended sessions', async () => {
      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: { sessionId: 'test-expired' },
        layer: 'localStorage'
      });

      (SessionService.getSessionData as jest.Mock).mockReturnValue({
        phase: 'extended',
        expiresAt: Date.now() - 1000
      });

      (SessionService.isSessionExpired as jest.Mock).mockReturnValue(true);

      render(
        <RecoveryDialog
          sessionId="test-expired"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('recovery.expired.title')).toBeInTheDocument();
        expect(screen.getByText('recovery.expired.message')).toBeInTheDocument();
      });
    });
  });

  describe('Recovery Actions', () => {
    it('should restore session with exact position on continue', async () => {
      const sessionData = {
        sessionId: 'test-restore',
        currentStep: 'questions',
        selectedFormat: 'sais',
        formatProgress: {
          currentQuestionIndex: 7
        }
      };

      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: sessionData
      });

      mockRestoreFromSession.mockReturnValue(true);

      render(
        <RecoveryDialog
          sessionId="test-restore"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        const continueButton = screen.getByText('recovery.continue');
        fireEvent.click(continueButton);
      });

      expect(mockRestoreFromSession).toHaveBeenCalledWith('test-restore');
      expect(mockOnContinue).toHaveBeenCalled();
    });

    it('should clean up session data on restart', async () => {
      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: { sessionId: 'test-cleanup' }
      });

      (storageService.removeItem as jest.Mock).mockReturnValue(true);

      render(
        <RecoveryDialog
          sessionId="test-cleanup"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        const restartButton = screen.getByText('recovery.startFresh');
        fireEvent.click(restartButton);
      });

      expect(storageService.removeItem).toHaveBeenCalledWith('test-cleanup');
      expect(mockSetSessionId).toHaveBeenCalledWith(expect.stringMatching(/^session-\d+-\w+$/));
      expect(mockOnRestart).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle recovery errors gracefully', async () => {
      (storageService.getItem as jest.Mock).mockReturnValue({
        success: true,
        data: { sessionId: 'test-error' }
      });

      mockRestoreFromSession.mockReturnValue(false);

      render(
        <RecoveryDialog
          sessionId="test-error"
          isOpen={true}
          onClose={mockOnClose}
          onContinue={mockOnContinue}
          onRestart={mockOnRestart}
        />
      );

      await waitFor(() => {
        const continueButton = screen.getByText('recovery.continue');
        fireEvent.click(continueButton);
      });

      await waitFor(() => {
        expect(screen.getByText('recovery.error')).toBeInTheDocument();
        expect(screen.getByText('Failed to restore session data')).toBeInTheDocument();
      });
    });
  });
});