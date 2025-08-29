/**
 * Tests for Optimized Storage Service - SAIS data compression and optimization
 */

import { OptimizedStorageService } from '../OptimizedStorageService';
import { QuestionResponse } from '@/lib/types';

describe('OptimizedStorageService', () => {
  let service: OptimizedStorageService;

  beforeEach(() => {
    service = new OptimizedStorageService();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('compressSAISResponses', () => {
    it('should compress SAIS distribution responses efficiently', () => {
      const saisResponses: QuestionResponse[] = [
        {
          questionId: '5',
          responseId: 'r1',
          sessionId: 'test-session',
          questionType: 'extended',
          responseType: 'distribution',
          distributionA: 3,
          distributionB: 2,
          mbtiDimension: 'E-I',
          responseTime: new Date('2024-01-01T12:00:00Z'),
          timeSpent: 15,
          score: 0
        },
        {
          questionId: '6',
          responseId: 'r2',
          sessionId: 'test-session',
          questionType: 'extended',
          responseType: 'distribution',
          distributionA: 4,
          distributionB: 1,
          mbtiDimension: 'S-N',
          responseTime: new Date('2024-01-01T12:01:00Z'),
          timeSpent: 20,
          score: 0
        }
      ];

      const result = service.compressSAISResponses(saisResponses);

      expect(result.compressedSize).toBeLessThan(result.originalSize);
      expect(result.compressionRatio).toBeGreaterThan(0);
      expect(result.compressed).toContain('"format":"sais"');
      expect(result.compressed).toContain('"q":5');
      expect(result.compressed).toContain('"a":3');
      expect(result.compressed).toContain('"b":2');
      expect(result.compressed).toContain('"d":"E"');
    });

    it('should filter out non-SAIS responses', () => {
      const mixedResponses: QuestionResponse[] = [
        {
          questionId: '1',
          responseType: 'binary',
          selectedOption: 'A',
          mbtiDimension: 'E-I'
        } as QuestionResponse,
        {
          questionId: '5',
          responseType: 'distribution',
          distributionA: 3,
          distributionB: 2,
          mbtiDimension: 'E-I'
        } as QuestionResponse
      ];

      const result = service.compressSAISResponses(mixedResponses);
      const parsed = JSON.parse(result.compressed);
      
      expect(parsed.responses).toHaveLength(1);
      expect(parsed.responses[0].q).toBe(5);
    });
  });

  describe('decompressSAISResponses', () => {
    it('should restore compressed responses to original format', () => {
      const compressed = JSON.stringify({
        format: 'sais',
        responses: [
          { q: 5, a: 3, b: 2, d: 'E', t: 1704110400 },
          { q: 6, a: 4, b: 1, d: 'S', t: 1704110460 }
        ],
        metadata: { totalQuestions: 16, completed: 2, lastModified: Date.now() }
      });

      const decompressed = service.decompressSAISResponses(compressed);

      expect(decompressed).toHaveLength(2);
      expect(decompressed[0]).toMatchObject({
        questionId: '5',
        questionType: 'extended',
        responseType: 'distribution',
        distributionA: 3,
        distributionB: 2,
        mbtiDimension: 'E-I'
      });
      expect(decompressed[1]).toMatchObject({
        questionId: '6',
        distributionA: 4,
        distributionB: 1,
        mbtiDimension: 'S-N'
      });
    });

    it('should handle invalid compressed data gracefully', () => {
      const invalid = 'invalid json';
      const result = service.decompressSAISResponses(invalid);
      
      expect(result).toEqual([]);
    });
  });

  describe('storeSAISAssessment', () => {
    it('should store SAIS assessment with compression', () => {
      const sessionId = 'test-sais-session';
      const assessmentData = {
        selectedFormat: 'sais',
        extendedResponses: [
          {
            questionId: '5',
            responseType: 'distribution',
            distributionA: 3,
            distributionB: 2,
            mbtiDimension: 'E-I'
          }
        ],
        progress: 50,
        currentStep: 'questions'
      };

      const stored = service.storeSAISAssessment(sessionId, assessmentData);

      expect(stored).toBe(true);
      
      // Check main data is stored
      const mainData = localStorage.getItem(sessionId);
      expect(mainData).toBeTruthy();
      const parsed = JSON.parse(mainData!);
      expect(parsed.extendedResponsesCompressed).toBe(true);
      expect(parsed.compressionStats).toBeDefined();
      
      // Check compressed data is stored separately
      const compressedData = localStorage.getItem(`sais_compressed_${sessionId}`);
      expect(compressedData).toBeTruthy();
    });

    it('should store non-SAIS assessments normally', () => {
      const sessionId = 'test-scenarios-session';
      const assessmentData = {
        selectedFormat: 'scenarios',
        extendedResponses: [],
        progress: 25
      };

      const stored = service.storeSAISAssessment(sessionId, assessmentData);

      expect(stored).toBe(true);
      const data = localStorage.getItem(sessionId);
      const parsed = JSON.parse(data!);
      expect(parsed.extendedResponsesCompressed).toBeUndefined();
    });
  });

  describe('retrieveSAISAssessment', () => {
    it('should retrieve and decompress SAIS assessment', () => {
      const sessionId = 'test-retrieve-sais';
      const originalData = {
        selectedFormat: 'sais',
        extendedResponses: [
          {
            questionId: '5',
            responseType: 'distribution',
            distributionA: 3,
            distributionB: 2,
            mbtiDimension: 'E-I',
            responseTime: new Date()
          }
        ],
        progress: 50
      };

      // Store first
      service.storeSAISAssessment(sessionId, originalData);
      
      // Then retrieve
      const retrieved = service.retrieveSAISAssessment(sessionId);

      expect(retrieved).toBeTruthy();
      expect(retrieved.selectedFormat).toBe('sais');
      expect(retrieved.extendedResponses).toHaveLength(1);
      expect(retrieved.extendedResponses[0]).toMatchObject({
        questionId: '5',
        distributionA: 3,
        distributionB: 2,
        sessionId: sessionId
      });
      expect(retrieved.extendedResponsesCompressed).toBeUndefined();
    });
  });

  describe('batchUpdateSAIS', () => {
    jest.useFakeTimers();

    it('should batch multiple rapid updates', () => {
      const storeSpy = jest.spyOn(service, 'storeSAISAssessment');
      const sessionId = 'test-batch';
      
      // Rapid updates simulating point allocation changes
      service.batchUpdateSAIS(sessionId, { update: 1 });
      service.batchUpdateSAIS(sessionId, { update: 2 });
      service.batchUpdateSAIS(sessionId, { update: 3 });
      
      // Should not store immediately
      expect(storeSpy).not.toHaveBeenCalled();
      
      // Fast forward past debounce time
      jest.advanceTimersByTime(600);
      
      // Should store only once with latest data
      expect(storeSpy).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(sessionId, { update: 3 });
    });

    jest.useRealTimers();
  });

  describe('cleanupSAISData', () => {
    it('should remove both main and compressed data', () => {
      const sessionId = 'test-cleanup';
      
      // Setup data
      localStorage.setItem(sessionId, JSON.stringify({ main: 'data' }));
      localStorage.setItem(`sais_compressed_${sessionId}`, JSON.stringify({ compressed: 'data' }));
      
      service.cleanupSAISData(sessionId);
      
      expect(localStorage.getItem(sessionId)).toBeNull();
      expect(localStorage.getItem(`sais_compressed_${sessionId}`)).toBeNull();
    });
  });

  describe('checkSAISStorageHealth', () => {
    it('should return storage metrics', () => {
      // Add some test data
      localStorage.setItem('test1', 'x'.repeat(100));
      localStorage.setItem('sais_compressed_session1', JSON.stringify({ data: 'compressed' }));
      localStorage.setItem('sais_compressed_session2', JSON.stringify({ data: 'compressed' }));
      
      const health = service.checkSAISStorageHealth();
      
      expect(health.available).toBe(true);
      expect(health.usedSpace).toBeGreaterThan(0);
      expect(health.estimatedCapacity).toBeGreaterThan(0);
      expect(health.compressedSessions).toBe(2);
    });
  });

  describe('export/import functionality', () => {
    it('should export and import SAIS data', () => {
      const sessionId = 'test-export';
      const testData = {
        selectedFormat: 'sais',
        extendedResponses: [
          {
            questionId: '5',
            responseType: 'distribution',
            distributionA: 5,
            distributionB: 0,
            mbtiDimension: 'T-F'
          }
        ]
      };
      
      // Store original
      service.storeSAISAssessment(sessionId, testData);
      
      // Export
      const exported = service.exportSAISData(sessionId);
      expect(exported).toBeTruthy();
      
      // Clear storage
      service.cleanupSAISData(sessionId);
      expect(service.retrieveSAISAssessment(sessionId)).toBeNull();
      
      // Import
      const imported = service.importSAISData(exported!);
      expect(imported).toBe(true);
      
      // Verify imported data
      const retrieved = service.retrieveSAISAssessment(sessionId);
      expect(retrieved).toBeTruthy();
      expect(retrieved.extendedResponses[0]).toMatchObject({
        distributionA: 5,
        distributionB: 0
      });
    });
  });

  describe('compression efficiency', () => {
    it('should achieve significant compression for large SAIS datasets', () => {
      // Create 12 SAIS responses (full extended assessment)
      const responses: QuestionResponse[] = Array.from({ length: 12 }, (_, i) => ({
        questionId: `${i + 5}`,
        responseId: `r${i + 5}`,
        sessionId: 'test-large',
        questionType: 'extended' as const,
        responseType: 'distribution' as const,
        distributionA: Math.floor(Math.random() * 6),
        distributionB: 5 - Math.floor(Math.random() * 6),
        mbtiDimension: ['E-I', 'S-N', 'T-F', 'J-P'][i % 4] as any,
        responseTime: new Date(),
        timeSpent: 15 + Math.floor(Math.random() * 30),
        score: 0
      }));
      
      const result = service.compressSAISResponses(responses);
      
      // Should achieve at least 40% compression
      expect(result.compressionRatio).toBeGreaterThan(40);
      console.log(`Compression ratio for 12 SAIS responses: ${result.compressionRatio.toFixed(1)}%`);
    });
  });
});