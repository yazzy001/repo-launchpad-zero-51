import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Interface definitions that match Ujjual's backend response
export interface BackendProfileData {
  name: string;
  description: string;
  jobTitle: string;
  company: string;
  location: string;
  image: string;
  skills: string[];
  projects: Array<{ name: string; role?: string; year?: string }>;
  experience: Array<{ company: string; position: string; duration?: string }>;
  generatedAt: string;
  sourceUrl: string;
  confidence: number;
  dataQuality?: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
  warnings?: string[];
  errors?: string[];
  processingTime?: number;
  stats?: any;
}

export interface ApiResponse {
  success: boolean;
  data?: BackendProfileData;
  error?: string;
  message?: string;
  id?: string;
  savedTo?: string;
  stats?: any;
}

export interface BackendStatus {
  available: boolean;
  services?: {
    gemini: boolean;
    braveSearch: boolean;
    scraping: boolean;
  };
  error?: string;
  timestamp?: string;
}

class RealBackendAPI {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 second timeout
  });

  async getBackendStatus(): Promise<BackendStatus> {
    try {
      const response = await this.client.get('/api/health');
      return { available: true, ...response.data };
    } catch (error: any) {
      console.error('Backend health check failed:', error);
      return { available: false, error: error.message || 'Backend not reachable' };
    }
  }

  async runPipeline(url: string, industry: string = 'technology'): Promise<ApiResponse> {
    try {
      console.log('🚀 Calling Ujjual\'s backend API...', { url, industry });
      const response = await this.client.post('/api/run', { url, industry });
      
      console.log('✅ Backend response received:', response.data);
      const backendData = response.data.finalProfile;

      const frontendProfile: BackendProfileData = {
        name: backendData.name || 'Unknown',
        description: backendData.description || 'No description available.',
        jobTitle: backendData.jobTitle || 'N/A',
        company: backendData.worksFor?.name || 'N/A',
        location: backendData.address?.addressLocality || 'N/A',
        image: backendData.image || 'https://via.placeholder.com/150',
        skills: backendData.skills || [],
        projects: backendData.projects || [],
        experience: backendData.workExperience || [],
        generatedAt: new Date().toISOString(),
        sourceUrl: url,
        confidence: backendData.confidence || 0.85,
        dataQuality: backendData.dataQuality,
        warnings: backendData.warnings,
        errors: backendData.errors,
        processingTime: response.data.stats?.totalTime || 0,
        stats: response.data.stats,
      };

      return { success: true, data: frontendProfile, message: 'Profile generated successfully with Ujjual\'s AI backend', stats: response.data.stats };
    } catch (error: any) {
      console.error('Backend pipeline error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.error || error.message || 'Backend processing failed' };
    }
  }
}

export const realBackendAPI = new RealBackendAPI();
