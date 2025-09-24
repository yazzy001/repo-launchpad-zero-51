// Error handling utilities to prevent crashes
export class SafeProfileProcessor {
  static validateProfile(profile: any): boolean {
    if (!profile || typeof profile !== 'object') {
      return false;
    }
    
    // Ensure required properties exist with safe defaults
    if (typeof profile.confidence !== 'number') {
      profile.confidence = 0.8;
    }
    
    if (!profile.generatedAt) {
      profile.generatedAt = new Date().toISOString();
    }
    
    if (!profile.sourceUrl) {
      profile.sourceUrl = '';
    }
    
    if (!profile.name) {
      profile.name = 'Unknown';
    }
    
    return true;
  }
  
  static safeAccess<T>(obj: any, path: string, defaultValue: T): T {
    try {
      const keys = path.split('.');
      let current = obj;
      
      for (const key of keys) {
        if (current?.[key] !== undefined) {
          current = current[key];
        } else {
          return defaultValue;
        }
      }
      
      return current ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }
  
  static withErrorBoundary<T>(
    operation: () => T,
    fallback: T,
    errorMessage?: string
  ): T {
    try {
      return operation();
    } catch (error) {
      console.error(errorMessage || 'Operation failed:', error);
      return fallback;
    }
  }
}