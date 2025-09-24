export interface PersonProfile {
  name?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  description?: string;
  skills?: string[];
  image?: string;
  projects?: Array<{ name: string; role?: string; year?: string }>;
  experience?: Array<{ company: string; position: string; duration?: string }>;
  confidence: number;
  sourceUrl: string;
  generatedAt: string;
  dataQuality?: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
  errors?: string[];
  warnings?: string[];
}

export interface ProcessingResult {
  success: boolean;
  data?: PersonProfile;
  error?: string;
  retryCount?: number;
  processingTime?: number;
}

// Import WebScrapingService for API key checks
import { WebScrapingService } from './LLMService';

export class EnhancedWebScrapingService {
  private static readonly MAX_RETRIES = 3;
  private static readonly TIMEOUT_MS = 30000;
  private static readonly RATE_LIMIT_DELAY = 1000;
  
  static async scrapeUrl(url: string): Promise<{ success: boolean; content?: string; error?: string; metadata?: any }> {
    // Input validation
    if (!url || typeof url !== 'string') {
      return { success: false, error: 'Invalid URL provided' };
    }

    // URL validation with comprehensive checks
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { success: false, error: 'URL must use HTTP or HTTPS protocol' };
      }
    } catch (error) {
      return { success: false, error: 'Invalid URL format' };
    }

    let lastError: Error | null = null;
    
    // Retry mechanism with exponential backoff
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`Scraping attempt ${attempt}/${this.MAX_RETRIES} for URL: ${url}`);
        
        // Add delay between retries (exponential backoff)
        if (attempt > 1) {
          const delay = this.RATE_LIMIT_DELAY * Math.pow(2, attempt - 2);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const result = await this.attemptScrape(url);
        
        if (result.success) {
          return {
            success: true,
            content: result.content,
            metadata: {
              attempt,
              processingTime: result.processingTime,
              sourceType: this.detectSourceType(url),
              contentLength: result.content?.length || 0
            }
          };
        }
        
        lastError = new Error(result.error);
        
      } catch (error) {
        console.error(`Scraping attempt ${attempt} failed:`, error);
        lastError = error instanceof Error ? error : new Error('Unknown scraping error');
      }
    }

    return {
      success: false,
      error: `Failed after ${this.MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
    };
  }

  private static async attemptScrape(url: string): Promise<{ success: boolean; content?: string; error?: string; processingTime?: number }> {
    const startTime = Date.now();

    try {
      // Try direct fetch first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      let response: Response;
      
      try {
        response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ProfileBot/1.0; +https://profilebuilder.ai)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
      } catch (corsError) {
        clearTimeout(timeoutId);
        console.log('Direct fetch failed, trying CORS proxy...');
        
        // Fallback to CORS proxy with multiple options
        const proxies = [
          { 
            url: 'https://api.allorigins.win/get?url=',
            parseResponse: (data: any) => data.contents,
            isJson: true
          },
          {
            url: 'https://corsproxy.io/?',
            parseResponse: (data: string) => data,
            isJson: false
          },
          {
            url: 'https://thingproxy.freeboard.io/fetch/',
            parseResponse: (data: string) => data,
            isJson: false
          }
        ];
        
        for (const proxy of proxies) {
          try {
            console.log(`Trying CORS proxy: ${proxy.url}`);
            const proxyController = new AbortController();
            const proxyTimeoutId = setTimeout(() => proxyController.abort(), this.TIMEOUT_MS);
            
            const proxyResponse = await fetch(proxy.url + encodeURIComponent(url), {
              signal: proxyController.signal
            });
            
            clearTimeout(proxyTimeoutId);
            
            if (proxyResponse.ok) {
              const data = proxy.isJson ? await proxyResponse.json() : await proxyResponse.text();
              const content = proxy.parseResponse(data);
              
              if (typeof content === 'string' && content.length > 100) {
                console.log(`✅ CORS proxy successful!`);
                return {
                  success: true,
                  content,
                  processingTime: Date.now() - startTime
                };
              }
            }
          } catch (proxyError) {
            console.log(`Proxy ${proxy.url} failed, trying next...`);
            continue;
          }
        }
        
        throw new Error('All proxy methods failed');
      }

      // Validate response
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
        console.warn(`Unexpected content type: ${contentType}`);
      }

      const content = await response.text();
      
      // Validate content quality
      if (!content || content.length < 100) {
        throw new Error('Retrieved content is too short or empty');
      }

      // Check for common error pages
      if (this.isErrorPage(content)) {
        throw new Error('Retrieved content appears to be an error page');
      }

      return {
        success: true,
        content,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape URL',
        processingTime: Date.now() - startTime
      };
    }
  }

  private static isErrorPage(content: string): boolean {
    const errorIndicators = [
      'page not found',
      '404 error',
      'access denied',
      'forbidden',
      'rate limit',
      'temporarily unavailable',
      'service unavailable'
    ];
    
    const lowerContent = content.toLowerCase();
    return errorIndicators.some(indicator => lowerContent.includes(indicator));
  }

  private static detectSourceType(url: string): string {
    const domain = new URL(url).hostname.toLowerCase();
    
    if (domain.includes('linkedin.com')) return 'LinkedIn';
    if (domain.includes('github.com')) return 'GitHub';
    if (domain.includes('imdb.com')) return 'IMDB';
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'Twitter';
    if (domain.includes('facebook.com')) return 'Facebook';
    if (domain.includes('instagram.com')) return 'Instagram';
    
    return 'Website';
  }
}

export class EnhancedLLMService {
  private static readonly GEMINI_KEY = 'gemini_api_key';
  private static readonly MAX_RETRIES = 3;
  private static readonly TIMEOUT_MS = 60000;
  private static readonly MAX_CONTENT_LENGTH = 50000;

  static saveGeminiApiKey(apiKey: string): boolean {
    try {
      if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
        throw new Error('Invalid API key format');
      }
      
      localStorage.setItem(this.GEMINI_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Failed to save API key:', error);
      return false;
    }
  }

  static getGeminiApiKey(): string | null {
    try {
      return localStorage.getItem(this.GEMINI_KEY);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }

  static validateApiKey(apiKey: string): boolean {
    return !!(apiKey && 
              typeof apiKey === 'string' && 
              apiKey.length >= 10 && 
              apiKey.startsWith('AIza'));
  }

  static async extractPersonProfile(sourceUrl: string, rawContent: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Input validation
      if (!sourceUrl || !rawContent) {
        return {
          success: false,
          error: 'Missing required parameters: sourceUrl or rawContent'
        };
      }

      const geminiKey = this.getGeminiApiKey();
      
      // Allow operation with just ScrapingBee if available
      const scrapingBeeKey = WebScrapingService.getScrapingBeeApiKey();
      if (!scrapingBeeKey && (!geminiKey || !this.validateApiKey(geminiKey))) {
        return {
          success: false,
          error: 'Please set ScrapingBee API key for optimal results, or provide a valid Gemini API key'
        };
      }

      // Content preprocessing with enhanced cleaning  
      const cleanContent = this.preprocessContent(rawContent);
      
      // Check for LinkedIn authwall (special case)
      if (sourceUrl.includes('linkedin.com') && rawContent.includes('authwall')) {
        return {
          success: false,
          error: 'LinkedIn profile requires authentication - cannot access profile data'
        };
      }
      
      if (cleanContent.length < 50) {
        return {
          success: false,
          error: 'Content too short after preprocessing'
        };
      }

      // Retry mechanism for LLM calls
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
        try {
          console.log(`LLM processing attempt ${attempt}/${this.MAX_RETRIES}`);
          
          const result = await this.callGeminiAPI(sourceUrl, cleanContent, geminiKey);
          
          if (result.success && result.data) {
            // Enhanced data validation and quality assessment
            const validatedProfile = this.validateAndEnhanceProfile(result.data, sourceUrl);
            
            return {
              success: true,
              data: validatedProfile,
              retryCount: attempt,
              processingTime: Date.now() - startTime
            };
          }
          
          lastError = new Error(result.error || 'LLM processing failed');
          
          // Add delay between retries
          if (attempt < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
          
        } catch (error) {
          console.error(`LLM attempt ${attempt} failed:`, error);
          lastError = error instanceof Error ? error : new Error('Unknown LLM error');
        }
      }

      return {
        success: false,
        error: `Failed after ${this.MAX_RETRIES} attempts: ${lastError?.message}`,
        retryCount: this.MAX_RETRIES,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown processing error',
        processingTime: Date.now() - startTime
      };
    }
  }

  private static preprocessContent(rawContent: string): string {
    let content = rawContent;
    
    // Remove scripts, styles, and other non-content elements
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      .replace(/<canvas[^>]*>[\s\S]*?<\/canvas>/gi, '');
    
    // Remove HTML tags but preserve structure
    content = content
      .replace(/<\/?(h[1-6]|p|div|section|article)[^>]*>/gi, '\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' ');
    
    // Clean up whitespace and special characters
    content = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // Truncate if too long
    if (content.length > this.MAX_CONTENT_LENGTH) {
      content = content.slice(0, this.MAX_CONTENT_LENGTH) + '...';
    }
    
    return content;
  }

  private static async callGeminiAPI(sourceUrl: string, cleanContent: string, apiKey: string): Promise<{ success: boolean; data?: PersonProfile; error?: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const prompt = this.buildEnhancedPrompt(sourceUrl, cleanContent);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      // Parse JSON response with error handling
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;

      try {
        const parsed = JSON.parse(jsonText);
        return { success: true, data: parsed };
      } catch (parseError) {
        console.error('JSON parsing failed:', jsonText);
        throw new Error('Failed to parse AI response as JSON');
      }

    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown API error'
      };
    }
  }

  private static buildEnhancedPrompt(sourceUrl: string, cleanContent: string): string {
    const sourceType = EnhancedWebScrapingService['detectSourceType'](sourceUrl);
    
    return `You are an expert data extraction specialist. Extract comprehensive profile information from this ${sourceType} webpage and return as valid JSON.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no markdown, no explanations, no extra text
2. Follow the exact TypeScript interface below
3. Extract ONLY factual information present in the content
4. Calculate confidence based on data quality and completeness
5. Include data quality assessment

TypeScript Interface:
{
  "name": string,
  "jobTitle": string,
  "company": string,
  "location": string,
  "description": string,
  "skills": string[],
  "image"?: string,
  "projects"?: Array<{"name": string, "role"?: string, "year"?: string}>,
  "experience"?: Array<{"company": string, "position": string, "duration"?: string}>,
  "confidence": number,
  "sourceUrl": "${sourceUrl}",
  "generatedAt": "${new Date().toISOString()}",
  "dataQuality": {
    "completeness": number,
    "accuracy": number,
    "consistency": number
  },
  "errors": string[],
  "warnings": string[]
}

EXTRACTION GUIDELINES:
- Skills: Extract technical skills, programming languages, tools, certifications
- Experience: List previous roles with companies and durations if available
- Projects: Notable projects, contributions, or achievements
- Confidence: 0.0-1.0 based on data completeness and source reliability
- Data Quality: Assess completeness (0-100), accuracy (0-100), consistency (0-100)
- Errors: List any data inconsistencies or missing critical information
- Warnings: Note any assumptions made or uncertain information

SOURCE TYPE: ${sourceType}
SOURCE URL: ${sourceUrl}

WEBPAGE CONTENT:
${cleanContent}

Return the JSON object now:`;
  }

  private static validateAndEnhanceProfile(profile: any, sourceUrl: string): PersonProfile {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Ensure required fields
    if (!profile.name || typeof profile.name !== 'string') {
      errors.push('Missing or invalid name field');
      profile.name = profile.name || '';
    }

    if (!profile.jobTitle || typeof profile.jobTitle !== 'string') {
      warnings.push('Job title not found or unclear');
      profile.jobTitle = profile.jobTitle || '';
    }

    if (!profile.company || typeof profile.company !== 'string') {
      warnings.push('Company information not available');
      profile.company = profile.company || '';
    }

    // Validate arrays
    if (profile.skills && !Array.isArray(profile.skills)) {
      warnings.push('Skills data format issue - converted to array');
      profile.skills = [];
    }

    if (profile.projects && !Array.isArray(profile.projects)) {
      warnings.push('Projects data format issue - converted to array');
      profile.projects = [];
    }

    if (profile.experience && !Array.isArray(profile.experience)) {
      warnings.push('Experience data format issue - converted to array');
      profile.experience = [];
    }

    // Validate confidence score
    if (typeof profile.confidence !== 'number' || profile.confidence < 0 || profile.confidence > 1) {
      warnings.push('Invalid confidence score - using default');
      profile.confidence = 0.5;
    }

    // Calculate data quality if not provided
    if (!profile.dataQuality) {
      profile.dataQuality = this.calculateDataQuality(profile);
    }

    // Ensure required metadata
    profile.sourceUrl = profile.sourceUrl || sourceUrl;
    profile.generatedAt = profile.generatedAt || new Date().toISOString();
    profile.errors = [...(profile.errors || []), ...errors];
    profile.warnings = [...(profile.warnings || []), ...warnings];

    return profile as PersonProfile;
  }

  private static calculateDataQuality(profile: any): { completeness: number; accuracy: number; consistency: number } {
    const fields = ['name', 'jobTitle', 'company', 'location', 'description'];
    const completedFields = fields.filter(field => profile[field] && profile[field].length > 0).length;
    const completeness = (completedFields / fields.length) * 100;

    // Simple heuristics for accuracy and consistency
    const accuracy = profile.name && profile.name.length > 1 ? 85 : 60;
    const consistency = profile.company && profile.jobTitle ? 90 : 70;

    return {
      completeness: Math.round(completeness),
      accuracy: Math.round(accuracy),
      consistency: Math.round(consistency)
    };
  }
}