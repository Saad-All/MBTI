/**
 * Tests for SessionService - phase-based session management
 */

import { SessionService } from '../SessionService';

describe('SessionService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('initializeSession', () => {
    it('should initialize a core session with 3 hour timeout', () => {
      const sessionId = 'test-session-123';
      const sessionData = SessionService.initializeSession(sessionId, 'core');

      expect(sessionData.sessionId).toBe(sessionId);
      expect(sessionData.phase).toBe('core');
      expect(sessionData.createdAt).toBeLessThanOrEqual(Date.now());
      expect(sessionData.expiresAt).toBeGreaterThan(Date.now());
      
      // Check 3 hour timeout
      const expectedTimeout = 3 * 60 * 60 * 1000;
      const actualTimeout = sessionData.expiresAt - sessionData.createdAt;
      expect(actualTimeout).toBe(expectedTimeout);
    });

    it('should initialize an extended session with 48 hour timeout', () => {
      const sessionId = 'test-session-456';
      const sessionData = SessionService.initializeSession(sessionId, 'extended');

      expect(sessionData.phase).toBe('extended');
      
      // Check 48 hour timeout
      const expectedTimeout = 48 * 60 * 60 * 1000;
      const actualTimeout = sessionData.expiresAt - sessionData.createdAt;
      expect(actualTimeout).toBe(expectedTimeout);
    });
  });

  describe('transitionToExtendedPhase', () => {
    it('should transition from core to extended phase', () => {
      const sessionId = 'test-session-789';
      
      // Start with core session
      SessionService.initializeSession(sessionId, 'core');
      
      // Transition to extended
      const extendedData = SessionService.transitionToExtendedPhase(sessionId);
      
      expect(extendedData).not.toBeNull();
      expect(extendedData!.phase).toBe('extended');
      expect(extendedData!.extendedPhaseStartedAt).toBeDefined();
      
      // Check new 48 hour timeout
      const expectedTimeout = 48 * 60 * 60 * 1000;
      const timeUntilExpiration = extendedData!.expiresAt - Date.now();
      expect(timeUntilExpiration).toBeGreaterThan(expectedTimeout - 1000); // Within 1 second
    });

    it('should return null for non-existent session', () => {
      const result = SessionService.transitionToExtendedPhase('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('isExtendedPhase', () => {
    it('should return true for extended phase session', () => {
      const sessionId = 'test-extended';
      SessionService.initializeSession(sessionId, 'extended');
      
      expect(SessionService.isExtendedPhase()).toBe(true);
    });

    it('should return false for core phase session', () => {
      const sessionId = 'test-core';
      SessionService.initializeSession(sessionId, 'core');
      
      expect(SessionService.isExtendedPhase()).toBe(false);
    });

    it('should return false when no session exists', () => {
      expect(SessionService.isExtendedPhase()).toBe(false);
    });
  });

  describe('isSessionExpired', () => {
    it('should return false for active session', () => {
      const sessionId = 'test-active';
      SessionService.initializeSession(sessionId, 'core');
      
      expect(SessionService.isSessionExpired()).toBe(false);
    });

    it('should return true for expired session', () => {
      const sessionId = 'test-expired';
      const sessionData = SessionService.initializeSession(sessionId, 'core');
      
      // Manually set expiration to past
      sessionData.expiresAt = Date.now() - 1000;
      localStorage.setItem('mbti-session-data', JSON.stringify(sessionData));
      
      expect(SessionService.isSessionExpired()).toBe(true);
    });
  });

  describe('updateActivity', () => {
    it('should extend expiration for active extended session', () => {
      const sessionId = 'test-extend';
      SessionService.initializeSession(sessionId, 'extended');
      
      const initialData = SessionService.getSessionData();
      const initialExpiration = initialData!.expiresAt;
      
      // Wait a moment then update activity
      setTimeout(() => {
        SessionService.updateActivity();
        
        const updatedData = SessionService.getSessionData();
        expect(updatedData!.lastActiveAt).toBeGreaterThan(initialData!.lastActiveAt);
        expect(updatedData!.expiresAt).toBeGreaterThan(initialExpiration);
      }, 100);
    });

    it('should not extend core session expiration', () => {
      const sessionId = 'test-core-no-extend';
      SessionService.initializeSession(sessionId, 'core');
      
      const initialData = SessionService.getSessionData();
      const initialExpiration = initialData!.expiresAt;
      
      SessionService.updateActivity();
      
      const updatedData = SessionService.getSessionData();
      expect(updatedData!.expiresAt).toBe(initialExpiration);
    });
  });

  describe('getTimeRemaining', () => {
    it('should return correct time remaining', () => {
      const sessionId = 'test-time-remaining';
      SessionService.initializeSession(sessionId, 'core');
      
      const timeRemaining = SessionService.getTimeRemaining();
      const expectedTimeout = 3 * 60 * 60 * 1000;
      
      expect(timeRemaining).toBeLessThanOrEqual(expectedTimeout);
      expect(timeRemaining).toBeGreaterThan(expectedTimeout - 1000); // Within 1 second
    });

    it('should return 0 for expired session', () => {
      const sessionId = 'test-expired-time';
      const sessionData = SessionService.initializeSession(sessionId, 'core');
      
      // Manually expire session
      sessionData.expiresAt = Date.now() - 1000;
      localStorage.setItem('mbti-session-data', JSON.stringify(sessionData));
      
      expect(SessionService.getTimeRemaining()).toBe(0);
    });
  });

  describe('validateSessionState', () => {
    it('should validate core phase consistency', () => {
      const sessionId = 'test-validate-core';
      SessionService.initializeSession(sessionId, 'core');
      
      const assessmentState = {
        sessionId,
        currentStep: 'core-questions' as const,
        selectedFormat: null,
        language: 'en' as const,
        responses: [],
        coreResponses: [],
        extendedResponses: [],
        progress: 0,
        isComplete: false
      };
      
      expect(SessionService.validateSessionState(assessmentState)).toBe(true);
    });

    it('should validate extended phase consistency', () => {
      const sessionId = 'test-validate-extended';
      SessionService.initializeSession(sessionId, 'core');
      SessionService.transitionToExtendedPhase(sessionId);
      
      const assessmentState = {
        sessionId,
        currentStep: 'questions' as const,
        selectedFormat: 'sais' as const,
        language: 'en' as const,
        responses: [],
        coreResponses: [],
        extendedResponses: [],
        progress: 0,
        isComplete: false
      };
      
      expect(SessionService.validateSessionState(assessmentState)).toBe(true);
    });

    it('should fail validation for mismatched session ID', () => {
      const sessionId = 'test-mismatch';
      SessionService.initializeSession(sessionId, 'core');
      
      const assessmentState = {
        sessionId: 'different-session',
        currentStep: 'core-questions' as const,
        selectedFormat: null,
        language: 'en' as const,
        responses: [],
        coreResponses: [],
        extendedResponses: [],
        progress: 0,
        isComplete: false
      };
      
      expect(SessionService.validateSessionState(assessmentState)).toBe(false);
    });
  });

  describe('cleanupExpiredSession', () => {
    it('should clean up expired session', () => {
      const sessionId = 'test-cleanup';
      const sessionData = SessionService.initializeSession(sessionId, 'core');
      
      // Manually expire session
      sessionData.expiresAt = Date.now() - 1000;
      localStorage.setItem('mbti-session-data', JSON.stringify(sessionData));
      
      SessionService.cleanupExpiredSession();
      
      expect(SessionService.getSessionData()).toBeNull();
    });

    it('should not clean up active session', () => {
      const sessionId = 'test-no-cleanup';
      SessionService.initializeSession(sessionId, 'core');
      
      SessionService.cleanupExpiredSession();
      
      expect(SessionService.getSessionData()).not.toBeNull();
    });
  });

  describe('getSessionSummary', () => {
    it('should return summary for active session', () => {
      const sessionId = 'test-summary';
      SessionService.initializeSession(sessionId, 'extended');
      
      const summary = SessionService.getSessionSummary();
      
      expect(summary.isActive).toBe(true);
      expect(summary.phase).toBe('extended');
      expect(summary.timeRemaining).toMatch(/\d+h \d+m/);
      expect(summary.expiresAt).toBeInstanceOf(Date);
    });

    it('should return inactive summary for no session', () => {
      const summary = SessionService.getSessionSummary();
      
      expect(summary.isActive).toBe(false);
      expect(summary.phase).toBeNull();
      expect(summary.timeRemaining).toBe('0h 0m');
      expect(summary.expiresAt).toBeNull();
    });
  });
});