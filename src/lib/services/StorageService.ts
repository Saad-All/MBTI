type StorageLayer = 'localStorage' | 'sessionStorage' | 'memory'

interface StorageResult<T = any> {
  success: boolean
  data?: T
  error?: string
  layer?: StorageLayer
}

interface StorageHealth {
  localStorage: boolean
  sessionStorage: boolean
}

class StorageService {
  private memoryStorage = new Map<string, string>()

  /**
   * Check storage layer health
   */
  checkStorageHealth(): StorageHealth {
    return {
      localStorage: this.isLocalStorageAvailable(),
      sessionStorage: this.isSessionStorageAvailable()
    }
  }

  /**
   * Get item with fallback chain: localStorage -> sessionStorage -> memory
   */
  getItem<T = any>(key: string): StorageResult<T> {
    // Try localStorage first
    const localResult = this.getFromLocalStorage<T>(key)
    if (localResult.success) {
      return { ...localResult, layer: 'localStorage' }
    }

    // Try sessionStorage
    const sessionResult = this.getFromSessionStorage<T>(key)
    if (sessionResult.success) {
      return { ...sessionResult, layer: 'sessionStorage' }
    }

    // Try memory storage
    const memoryResult = this.getFromMemory<T>(key)
    if (memoryResult.success) {
      return { ...memoryResult, layer: 'memory' }
    }

    return {
      success: false,
      error: 'Item not found in any storage layer',
      layer: 'memory'
    }
  }

  /**
   * Set item across available storage layers with graceful fallback
   */
  setItem(key: string, value: any): StorageResult {
    const serializedValue = JSON.stringify(value)
    let successCount = 0
    const errors: string[] = []

    // Try localStorage
    const localResult = this.setToLocalStorage(key, serializedValue)
    if (localResult.success) {
      successCount++
    } else {
      errors.push(`localStorage: ${localResult.error}`)
    }

    // Try sessionStorage
    const sessionResult = this.setToSessionStorage(key, serializedValue)
    if (sessionResult.success) {
      successCount++
    } else {
      errors.push(`sessionStorage: ${sessionResult.error}`)
    }

    // Always set in memory as final fallback
    this.memoryStorage.set(key, serializedValue)
    successCount++

    return {
      success: successCount > 0,
      data: { 
        savedTo: successCount,
        layers: successCount === 3 ? 'all' : 'partial',
        errors: errors.length > 0 ? errors : undefined
      }
    }
  }

  /**
   * Remove item from all storage layers
   */
  removeItem(key: string): StorageResult {
    let successCount = 0

    // Remove from localStorage
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key)
        successCount++
      } catch (error) {
        // Ignore localStorage removal errors
      }
    }

    // Remove from sessionStorage
    if (this.isSessionStorageAvailable()) {
      try {
        sessionStorage.removeItem(key)
        successCount++
      } catch (error) {
        // Ignore sessionStorage removal errors
      }
    }

    // Remove from memory
    this.memoryStorage.delete(key)
    successCount++

    return {
      success: true,
      data: { removedFrom: successCount }
    }
  }

  /**
   * Clear all stored data
   */
  clear(): StorageResult {
    let successCount = 0

    // Clear localStorage
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.clear()
        successCount++
      } catch (error) {
        // Ignore localStorage clear errors
      }
    }

    // Clear sessionStorage
    if (this.isSessionStorageAvailable()) {
      try {
        sessionStorage.clear()
        successCount++
      } catch (error) {
        // Ignore sessionStorage clear errors
      }
    }

    // Clear memory
    this.memoryStorage.clear()
    successCount++

    return {
      success: true,
      data: { clearedLayers: successCount }
    }
  }

  // Private methods for individual storage layers

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  private isSessionStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false
      const testKey = '__storage_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }


  private getFromLocalStorage<T>(key: string): StorageResult<T> {
    try {
      if (!this.isLocalStorageAvailable()) {
        return { success: false, error: 'localStorage not available' }
      }

      const item = localStorage.getItem(key)
      if (item === null) {
        return { success: false, error: 'Item not found' }
      }

      return {
        success: true,
        data: JSON.parse(item)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        return { success: false, error: 'Storage quota exceeded' }
      }
      return { success: false, error: 'localStorage read error' }
    }
  }

  private getFromSessionStorage<T>(key: string): StorageResult<T> {
    try {
      if (!this.isSessionStorageAvailable()) {
        return { success: false, error: 'sessionStorage not available' }
      }

      const item = sessionStorage.getItem(key)
      if (item === null) {
        return { success: false, error: 'Item not found' }
      }

      return {
        success: true,
        data: JSON.parse(item)
      }
    } catch (error) {
      return { success: false, error: 'sessionStorage read error' }
    }
  }


  private getFromMemory<T>(key: string): StorageResult<T> {
    try {
      const item = this.memoryStorage.get(key)
      if (!item) {
        return { success: false, error: 'Item not found in memory' }
      }

      return {
        success: true,
        data: JSON.parse(item)
      }
    } catch (error) {
      return { success: false, error: 'Memory storage read error' }
    }
  }

  private setToLocalStorage(key: string, value: string): StorageResult {
    try {
      if (!this.isLocalStorageAvailable()) {
        return { success: false, error: 'localStorage not available' }
      }

      localStorage.setItem(key, value)
      return { success: true }
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Try to free up space by removing old items
        this.cleanupOldStorageItems('localStorage')
        try {
          localStorage.setItem(key, value)
          return { success: true }
        } catch {
          return { success: false, error: 'Storage quota exceeded after cleanup' }
        }
      }
      return { success: false, error: 'localStorage write error' }
    }
  }

  private setToSessionStorage(key: string, value: string): StorageResult {
    try {
      if (!this.isSessionStorageAvailable()) {
        return { success: false, error: 'sessionStorage not available' }
      }

      sessionStorage.setItem(key, value)
      return { success: true }
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        return { success: false, error: 'Storage quota exceeded' }
      }
      return { success: false, error: 'sessionStorage write error' }
    }
  }


  private cleanupOldStorageItems(storageType: 'localStorage' | 'sessionStorage'): void {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage
      const keys = Object.keys(storage)
      
      // Remove oldest items (simple strategy - remove first half of items)
      const itemsToRemove = Math.ceil(keys.length / 2)
      for (let i = 0; i < itemsToRemove; i++) {
        storage.removeItem(keys[i])
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  // Cleanup method for component unmounting
  destroy(): void {
    this.memoryStorage.clear()
  }
}

// Export singleton instance
export const storageService = new StorageService()
export default storageService