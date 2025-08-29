/**
 * SessionService - Client-side session management with phase-based expiration
 * Handles different session phases (core vs extended) with appropriate timeouts
 */

import type { AssessmentState } from '../stores/assessment-store';

// Session timeout constants
const CORE_SESSION_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours
const EXTENDED_SESSION_TIMEOUT = 48 * 60 * 60 * 1000; // 48 hours
const SESSION_EXTENSION_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Session phase types
export type SessionPhase = 'core' | 'extended';

interface SessionData {
  sessionId: string;
  phase: SessionPhase;
  createdAt: number;
  lastActiveAt: number;
  expiresAt: number;
  extendedPhaseStartedAt?: number;
}

export class SessionService {
  private static SESSION_KEY = 'mbti-session-data';
  private static extensionTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize a new session
   */
  static initializeSession(sessionId: string, phase: SessionPhase = 'core'): SessionData {
    const now = Date.now();
    const timeout = this.getTimeoutForPhase(phase);
    
    const sessionData: SessionData = {
      sessionId,
      phase,
      createdAt: now,
      lastActiveAt: now,
      expiresAt: now + timeout,
    };

    this.saveSessionData(sessionData);
    this.startAutoExtension();
    
    return sessionData;
  }

  /**
   * Get timeout duration for a specific phase
   */
  static getTimeoutForPhase(phase: SessionPhase): number {
    return phase === 'extended' ? EXTENDED_SESSION_TIMEOUT : CORE_SESSION_TIMEOUT;
  }

  /**
   * Transition session to extended phase (after format selection)
   */
  static transitionToExtendedPhase(sessionId: string): SessionData | null {
    const sessionData = this.getSessionData();
    
    if (!sessionData || sessionData.sessionId !== sessionId) {
      return null;
    }

    const now = Date.now();
    sessionData.phase = 'extended';
    sessionData.extendedPhaseStartedAt = now;
    sessionData.lastActiveAt = now;
    sessionData.expiresAt = now + EXTENDED_SESSION_TIMEOUT;

    this.saveSessionData(sessionData);
    return sessionData;
  }

  /**
   * Update session activity (extends expiration during active use)
   */
  static updateActivity(): void {
    const sessionData = this.getSessionData();
    
    if (!sessionData || this.isSessionExpired(sessionData)) {
      return;
    }

    const now = Date.now();
    sessionData.lastActiveAt = now;
    
    // Only extend if actively being used (within last 5 minutes)
    if (sessionData.phase === 'extended') {
      const timeSinceLastActivity = now - sessionData.lastActiveAt;
      if (timeSinceLastActivity < SESSION_EXTENSION_INTERVAL) {
        // Extend by another 48 hours from now
        sessionData.expiresAt = now + EXTENDED_SESSION_TIMEOUT;
      }
    }

    this.saveSessionData(sessionData);
  }

  /**
   * Check if session is in extended phase
   */
  static isExtendedPhase(): boolean {
    const sessionData = this.getSessionData();
    return sessionData?.phase === 'extended' || false;
  }

  /**
   * Get current session phase
   */
  static getCurrentPhase(): SessionPhase | null {
    const sessionData = this.getSessionData();
    return sessionData?.phase || null;
  }

  /**
   * Check if session has expired
   */
  static isSessionExpired(sessionData?: SessionData | null): boolean {
    const data = sessionData || this.getSessionData();
    
    if (!data) {
      return true;
    }

    return Date.now() > data.expiresAt;
  }

  /**
   * Get time remaining for current session
   */
  static getTimeRemaining(): number {
    const sessionData = this.getSessionData();
    
    if (!sessionData || this.isSessionExpired(sessionData)) {
      return 0;
    }

    return Math.max(0, sessionData.expiresAt - Date.now());
  }

  /**
   * Clean up expired session
   */
  static cleanupExpiredSession(): void {
    const sessionData = this.getSessionData();
    
    if (sessionData && this.isSessionExpired(sessionData)) {
      this.clearSessionData();
    }
  }

  /**
   * Get session data from storage
   */
  static getSessionData(): SessionData | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      if (!data) return null;
      
      return JSON.parse(data) as SessionData;
    } catch {
      return null;
    }
  }

  /**
   * Save session data to storage
   */
  private static saveSessionData(data: SessionData): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  }

  /**
   * Clear session data
   */
  static clearSessionData(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      this.stopAutoExtension();
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }

  /**
   * Start automatic session extension timer
   */
  private static startAutoExtension(): void {
    this.stopAutoExtension();
    
    // Check every 5 minutes for activity-based extension
    this.extensionTimer = setInterval(() => {
      this.updateActivity();
    }, SESSION_EXTENSION_INTERVAL);
  }

  /**
   * Stop automatic session extension timer
   */
  private static stopAutoExtension(): void {
    if (this.extensionTimer) {
      clearInterval(this.extensionTimer);
      this.extensionTimer = null;
    }
  }

  /**
   * Validate assessment state matches session
   */
  static validateSessionState(assessmentState: AssessmentState): boolean {
    const sessionData = this.getSessionData();
    
    if (!sessionData) {
      return false;
    }

    // Check if session IDs match
    if (assessmentState.sessionId !== sessionData.sessionId) {
      return false;
    }

    // Check if session has expired
    if (this.isSessionExpired(sessionData)) {
      return false;
    }

    // Validate phase consistency
    const hasSelectedFormat = assessmentState.selectedFormat !== null && 
                            (assessmentState.currentStep === 'questions' || 
                             assessmentState.currentStep === 'results' ||
                             assessmentState.currentStep === 'coaching');
    const shouldBeExtended = hasSelectedFormat && sessionData.phase === 'extended';
    const shouldBeCore = !hasSelectedFormat && sessionData.phase === 'core';

    return shouldBeExtended || shouldBeCore;
  }

  /**
   * Get session summary for debugging/UI
   */
  static getSessionSummary(): {
    isActive: boolean;
    phase: SessionPhase | null;
    timeRemaining: string;
    expiresAt: Date | null;
  } {
    const sessionData = this.getSessionData();
    const isExpired = this.isSessionExpired(sessionData);
    
    if (!sessionData || isExpired) {
      return {
        isActive: false,
        phase: null,
        timeRemaining: '0h 0m',
        expiresAt: null,
      };
    }

    const timeRemaining = this.getTimeRemaining();
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    return {
      isActive: true,
      phase: sessionData.phase,
      timeRemaining: `${hours}h ${minutes}m`,
      expiresAt: new Date(sessionData.expiresAt),
    };
  }
}