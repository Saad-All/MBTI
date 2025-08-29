/**
 * Tests for format-specific progress tracking in assessment store
 */

import { useAppStore } from '../assessment-store';
import { CORE_QUESTIONS_COUNT, TOTAL_QUESTIONS, PROGRESS_MILESTONES } from '@/lib/constants/assessment';

describe('Assessment Store - Format-Specific Progress Tracking', () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      assessment: {
        sessionId: '',
        currentStep: 'welcome',
        language: 'en',
        responses: [],
        coreResponses: [],
        extendedResponses: [],
        selectedFormat: null,
        progress: 0,
        isComplete: false,
        formatProgress: undefined
      }
    });
  });

  describe('calculateFormatSpecificProgress', () => {
    it('should calculate core-only progress correctly', () => {
      const store = useAppStore.getState();
      
      // Add core responses
      store.setCoreResponses([
        { questionId: '1', responseId: 'r1', sessionId: 's1', questionType: 'core' } as any,
        { questionId: '2', responseId: 'r2', sessionId: 's1', questionType: 'core' } as any
      ]);
      
      const progress = store.calculateFormatSpecificProgress();
      
      // 2/4 core questions * 25% milestone = 12.5%
      expect(progress).toBe(12.5);
    });

    it('should calculate SAIS format progress correctly', () => {
      const store = useAppStore.getState();
      
      // Set format and add responses
      store.setSelectedFormat('sais');
      store.setCoreResponses([
        { questionId: '1', responseId: 'r1', sessionId: 's1', questionType: 'core' } as any,
        { questionId: '2', responseId: 'r2', sessionId: 's1', questionType: 'core' } as any,
        { questionId: '3', responseId: 'r3', sessionId: 's1', questionType: 'core' } as any,
        { questionId: '4', responseId: 'r4', sessionId: 's1', questionType: 'core' } as any
      ]);
      
      store.setExtendedResponses([
        { questionId: '5', responseId: 'r5', sessionId: 's1', questionType: 'extended' } as any,
        { questionId: '6', responseId: 'r6', sessionId: 's1', questionType: 'extended' } as any
      ]);
      
      const progress = store.calculateFormatSpecificProgress();
      
      // (4 core + 2 extended) / 16 total * 100 = 37.5%
      expect(Math.round(progress)).toBe(38); // 37.5 rounds to 38
    });

    it('should calculate traits format progress correctly', () => {
      const store = useAppStore.getState();
      
      store.setSelectedFormat('traits');
      store.setCoreResponses(new Array(4).fill({}).map((_, i) => ({ 
        questionId: `${i+1}`, 
        responseId: `r${i+1}`, 
        sessionId: 's1', 
        questionType: 'core' 
      } as any)));
      
      store.setExtendedResponses(new Array(8).fill({}).map((_, i) => ({ 
        questionId: `${i+5}`, 
        responseId: `r${i+5}`, 
        sessionId: 's1', 
        questionType: 'extended' 
      } as any)));
      
      const progress = store.calculateFormatSpecificProgress();
      
      // (4 core + 8 extended) / 20 total * 100 = 60%
      expect(progress).toBe(60);
    });
  });

  describe('setSelectedFormat', () => {
    it('should initialize format progress when format is selected', () => {
      const store = useAppStore.getState();
      
      store.setSelectedFormat('sais');
      
      const state = useAppStore.getState().assessment;
      
      expect(state.selectedFormat).toBe('sais');
      expect(state.formatProgress).toBeDefined();
      expect(state.formatProgress?.totalQuestions).toBe(TOTAL_QUESTIONS.sais);
      expect(state.formatProgress?.currentQuestionIndex).toBe(0);
      expect(state.formatProgress?.completedQuestions).toBe(CORE_QUESTIONS_COUNT);
      expect(state.formatProgress?.questionPool).toBe('sais-methodology');
      expect(state.progress).toBe(PROGRESS_MILESTONES.formatSelected);
    });

    it('should set correct total questions for each format', () => {
      const store = useAppStore.getState();
      
      // Test scenarios
      store.setSelectedFormat('scenarios');
      expect(useAppStore.getState().assessment.formatProgress?.totalQuestions).toBe(16);
      
      // Reset and test traits
      store.resetAssessment();
      store.setSelectedFormat('traits');
      expect(useAppStore.getState().assessment.formatProgress?.totalQuestions).toBe(20);
      
      // Reset and test sais
      store.resetAssessment();
      store.setSelectedFormat('sais');
      expect(useAppStore.getState().assessment.formatProgress?.totalQuestions).toBe(16);
    });
  });

  describe('updateFormatProgress', () => {
    it('should update current index and recalculate progress', () => {
      const store = useAppStore.getState();
      
      // Setup: select format and add some responses
      store.setSelectedFormat('sais');
      store.setCoreResponses(new Array(4).fill({}).map((_, i) => ({ 
        questionId: `${i+1}`, 
        responseId: `r${i+1}`, 
        sessionId: 's1', 
        questionType: 'core' 
      } as any)));
      
      store.setExtendedResponses(new Array(3).fill({}).map((_, i) => ({ 
        questionId: `${i+5}`, 
        responseId: `r${i+5}`, 
        sessionId: 's1', 
        questionType: 'extended' 
      } as any)));
      
      // Update format progress to question index 3 (4th extended question)
      store.updateFormatProgress(3);
      
      const state = useAppStore.getState().assessment;
      
      expect(state.formatProgress?.currentQuestionIndex).toBe(3);
      expect(state.formatProgress?.completedQuestions).toBe(CORE_QUESTIONS_COUNT + 3);
      
      // Progress should be recalculated: 7/16 * 100 = 43.75%
      expect(state.progress).toBe(44); // 43.75 rounds to 44
    });

    it('should handle edge cases gracefully', () => {
      const store = useAppStore.getState();
      
      // Calling updateFormatProgress without format selection should not crash
      store.updateFormatProgress(5);
      
      expect(useAppStore.getState().assessment.formatProgress).toBeUndefined();
    });
  });

  describe('persistState and restoreFromSession', () => {
    it('should persist and restore format progress', () => {
      const store = useAppStore.getState();
      const sessionId = 'test-session-123';
      
      // Setup state
      store.setSessionId(sessionId);
      store.setSelectedFormat('traits');
      store.updateFormatProgress(5);
      
      // Persist state
      store.persistState();
      
      // Reset store
      useAppStore.setState({
        assessment: {
          sessionId: '',
          currentStep: 'welcome',
          language: 'en',
          responses: [],
          coreResponses: [],
          extendedResponses: [],
          selectedFormat: null,
          progress: 0,
          isComplete: false,
          formatProgress: undefined
        }
      });
      
      // Restore state
      const restored = store.restoreFromSession(sessionId);
      
      expect(restored).toBe(true);
      
      const restoredState = useAppStore.getState().assessment;
      expect(restoredState.selectedFormat).toBe('traits');
      expect(restoredState.formatProgress?.totalQuestions).toBe(20);
      expect(restoredState.formatProgress?.currentQuestionIndex).toBe(5);
      expect(restoredState.formatProgress?.questionPool).toBe('personality-traits');
    });
  });

  describe('format validation', () => {
    it('should prevent conflicts between different format responses', () => {
      const store = useAppStore.getState();
      
      // Select SAIS format
      store.setSelectedFormat('sais');
      
      // Add SAIS-specific response
      store.addResponse({
        questionId: '5',
        responseId: 'sais-r1',
        sessionId: 's1',
        questionType: 'extended',
        responseType: 'distribution',
        distributionA: 3,
        distributionB: 2,
        mbtiDimension: 'E-I'
      } as any);
      
      const state = useAppStore.getState().assessment;
      
      // Verify response was added correctly
      expect(state.extendedResponses.length).toBe(1);
      expect(state.extendedResponses[0].responseType).toBe('distribution');
      expect(state.extendedResponses[0].distributionA).toBe(3);
      expect(state.extendedResponses[0].distributionB).toBe(2);
    });

    it('should maintain separate question pools', () => {
      const store = useAppStore.getState();
      
      // Test each format maintains its own question pool
      const formats = ['scenarios', 'traits', 'sais'] as const;
      
      formats.forEach(format => {
        store.resetAssessment();
        store.setSelectedFormat(format);
        
        const state = useAppStore.getState().assessment;
        expect(state.formatProgress?.questionPool).toBe({
          scenarios: 'life-scenarios',
          traits: 'personality-traits',
          sais: 'sais-methodology'
        }[format]);
      });
    });
  });
});