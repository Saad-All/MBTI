/**
 * Optimized Storage Service for SAIS Distribution Data
 * Implements compression and efficient serialization for complex assessment state
 */

import { QuestionResponse } from '@/lib/types';

interface CompressionResult {
  compressed: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

interface SAISOptimizedData {
  format: 'sais';
  responses: CompressedSAISResponse[];
  metadata: {
    totalQuestions: number;
    completed: number;
    lastModified: number;
  };
}

interface CompressedSAISResponse {
  q: number; // questionId (number for compression)
  a: number; // distributionA (0-5)
  b: number; // distributionB (0-5)
  d: string; // mbtiDimension (single char: E, S, T, J)
  t: number; // timestamp (epoch seconds)
}

export class OptimizedStorageService {
  private readonly COMPRESSION_PREFIX = 'sais_compressed_';
  private readonly MAX_BATCH_SIZE = 5; // Batch saves for rapid changes

  /**
   * Compress SAIS distribution responses for efficient storage
   */
  compressSAISResponses(responses: QuestionResponse[]): CompressionResult {
    const saisResponses = responses.filter(r => 
      r.responseType === 'distribution' && 
      r.distributionA !== undefined && 
      r.distributionB !== undefined
    );

    const compressed: CompressedSAISResponse[] = saisResponses.map(r => ({
      q: parseInt(r.questionId),
      a: r.distributionA!,
      b: r.distributionB!,
      d: this.compressDimension(r.mbtiDimension),
      t: Math.floor(new Date(r.timestamp || Date.now()).getTime() / 1000)
    }));

    const optimizedData: SAISOptimizedData = {
      format: 'sais',
      responses: compressed,
      metadata: {
        totalQuestions: 16,
        completed: saisResponses.length,
        lastModified: Date.now()
      }
    };

    const original = JSON.stringify(saisResponses);
    const optimized = JSON.stringify(optimizedData);

    return {
      compressed: optimized,
      originalSize: original.length,
      compressedSize: optimized.length,
      compressionRatio: (1 - optimized.length / original.length) * 100
    };
  }

  /**
   * Decompress SAIS responses back to original format
   */
  decompressSAISResponses(compressed: string): QuestionResponse[] {
    try {
      const data: SAISOptimizedData = JSON.parse(compressed);
      
      return data.responses.map(c => ({
        questionId: c.q.toString(),
        responseId: `sais-${c.q}-${Date.now()}`,
        sessionId: '', // Will be filled by caller
        questionType: 'extended' as const,
        responseType: 'distribution' as const,
        distributionA: c.a,
        distributionB: c.b,
        mbtiDimension: this.decompressDimension(c.d),
        timestamp: new Date(c.t * 1000),
        score: 0, // Calculated later
      }));
    } catch (error) {
      console.error('Failed to decompress SAIS responses:', error);
      return [];
    }
  }

  /**
   * Optimized storage strategy for SAIS data
   */
  storeSAISAssessment(sessionId: string, data: any): boolean {
    try {
      // Separate SAIS responses from other data
      const { extendedResponses = [], ...otherData } = data;
      
      // Compress SAIS responses if they exist
      if (extendedResponses.length > 0 && data.selectedFormat === 'sais') {
        const compression = this.compressSAISResponses(extendedResponses);
        
        // Store compressed SAIS data separately for better performance
        const compressedKey = `${this.COMPRESSION_PREFIX}${sessionId}`;
        localStorage.setItem(compressedKey, compression.compressed);
        
        // Store other data without extended responses
        const mainData = {
          ...otherData,
          extendedResponsesCompressed: true,
          compressionStats: {
            originalSize: compression.originalSize,
            compressedSize: compression.compressedSize,
            ratio: compression.compressionRatio
          }
        };
        
        localStorage.setItem(sessionId, JSON.stringify(mainData));
        
        // Log compression efficiency
        if (compression.compressionRatio > 0) {
          console.log(`SAIS compression saved ${compression.compressionRatio.toFixed(1)}% space`);
        }
        
        return true;
      } else {
        // Non-SAIS or no extended responses, store normally
        localStorage.setItem(sessionId, JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Failed to store SAIS assessment:', error);
      return false;
    }
  }

  /**
   * Retrieve SAIS assessment with decompression
   */
  retrieveSAISAssessment(sessionId: string): any | null {
    try {
      const mainDataStr = localStorage.getItem(sessionId);
      if (!mainDataStr) return null;
      
      const mainData = JSON.parse(mainDataStr);
      
      // Check if SAIS responses are compressed
      if (mainData.extendedResponsesCompressed) {
        const compressedKey = `${this.COMPRESSION_PREFIX}${sessionId}`;
        const compressedData = localStorage.getItem(compressedKey);
        
        if (compressedData) {
          const decompressed = this.decompressSAISResponses(compressedData);
          
          // Restore session ID
          const extendedResponses = decompressed.map(r => ({
            ...r,
            sessionId
          }));
          
          return {
            ...mainData,
            extendedResponses,
            extendedResponsesCompressed: undefined,
            compressionStats: undefined
          };
        }
      }
      
      return mainData;
    } catch (error) {
      console.error('Failed to retrieve SAIS assessment:', error);
      return null;
    }
  }

  /**
   * Batch storage optimization for rapid SAIS point allocation changes
   */
  private pendingUpdates = new Map<string, any>();
  private batchTimer: NodeJS.Timeout | null = null;

  batchUpdateSAIS(sessionId: string, data: any): void {
    // Store pending update
    this.pendingUpdates.set(sessionId, data);
    
    // Clear existing timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    // Set new timer for batch processing
    this.batchTimer = setTimeout(() => {
      this.processBatchUpdates();
    }, 500); // 500ms debounce for rapid changes
  }

  private processBatchUpdates(): void {
    this.pendingUpdates.forEach((data, sessionId) => {
      this.storeSAISAssessment(sessionId, data);
    });
    
    this.pendingUpdates.clear();
    this.batchTimer = null;
  }

  /**
   * Clean up compressed data when session is cleared
   */
  cleanupSAISData(sessionId: string): void {
    try {
      // Remove compressed data
      const compressedKey = `${this.COMPRESSION_PREFIX}${sessionId}`;
      localStorage.removeItem(compressedKey);
      
      // Remove main data
      localStorage.removeItem(sessionId);
      
      // Remove from pending updates if exists
      this.pendingUpdates.delete(sessionId);
    } catch (error) {
      console.error('Failed to cleanup SAIS data:', error);
    }
  }

  /**
   * Storage health check with SAIS-specific metrics
   */
  checkSAISStorageHealth(): {
    available: boolean;
    usedSpace: number;
    estimatedCapacity: number;
    compressedSessions: number;
  } {
    try {
      let usedSpace = 0;
      let compressedSessions = 0;
      
      // Calculate used space and count compressed sessions
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            usedSpace += key.length + value.length;
            
            if (key.startsWith(this.COMPRESSION_PREFIX)) {
              compressedSessions++;
            }
          }
        }
      }
      
      // Estimate available capacity (5MB typical limit)
      const estimatedCapacity = 5 * 1024 * 1024 - usedSpace;
      
      return {
        available: true,
        usedSpace,
        estimatedCapacity,
        compressedSessions
      };
    } catch (error) {
      return {
        available: false,
        usedSpace: 0,
        estimatedCapacity: 0,
        compressedSessions: 0
      };
    }
  }

  /**
   * Helper methods for dimension compression
   */
  private compressDimension(dimension: string): string {
    // Extract first character of dimension (E-I becomes E, etc.)
    return dimension.charAt(0);
  }

  private decompressDimension(compressed: string): 'E/I' | 'S/N' | 'T/F' | 'J/P' {
    const mapping: Record<string, 'E/I' | 'S/N' | 'T/F' | 'J/P'> = {
      'E': 'E/I',
      'S': 'S/N',
      'T': 'T/F',
      'J': 'J/P'
    };
    return mapping[compressed] || 'E/I';
  }

  /**
   * Export/Import functionality for backup
   */
  exportSAISData(sessionId: string): string | null {
    const data = this.retrieveSAISAssessment(sessionId);
    if (!data) return null;
    
    // Create exportable format with compression
    const exportData = {
      version: '1.0',
      format: 'sais-optimized',
      sessionId,
      timestamp: new Date().toISOString(),
      data: btoa(JSON.stringify(data)) // Base64 encode for safe transport
    };
    
    return JSON.stringify(exportData);
  }

  importSAISData(exportedData: string): boolean {
    try {
      const parsed = JSON.parse(exportedData);
      if (parsed.format !== 'sais-optimized') return false;
      
      const data = JSON.parse(atob(parsed.data));
      return this.storeSAISAssessment(parsed.sessionId, data);
    } catch (error) {
      console.error('Failed to import SAIS data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const optimizedStorage = new OptimizedStorageService();