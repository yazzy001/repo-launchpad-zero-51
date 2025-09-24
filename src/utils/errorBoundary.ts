// Error handling utilities to prevent crashes
export class SafeProfileProcessor {
  static validateProfile(profile: any): boolean {
    if (!profile || typeof profile !== 'object') {
      return false;
    }
    
    // Ensure required properties exist with safe defaults - be more lenient
    if (typeof profile.confidence !== 'number' || isNaN(profile.confidence)) {
      profile.confidence = 0.8;
    }
    
    if (!profile.generatedAt) {
      profile.generatedAt = new Date().toISOString();
    }
    
    if (!profile.sourceUrl) {
      profile.sourceUrl = '';
    }
    
    if (!profile.name || typeof profile.name !== 'string') {
      profile.name = 'Unknown Profile';
    }
    
    // Ensure arrays exist
    if (!Array.isArray(profile.skills)) {
      profile.skills = [];
    }
    
    if (!Array.isArray(profile.projects)) {
      profile.projects = [];
    }
    
    if (!Array.isArray(profile.experience)) {
      profile.experience = [];
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