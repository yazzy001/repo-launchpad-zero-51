export interface PersonProfile {
  name?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  description?: string;
  skills?: string[];
  image?: string;
  projects?: Array<{ name: string; role?: string; year?: string; rating?: string }>;
  experience?: Array<{ company: string; position: string; duration?: string }>;
  // Enhanced IMDB-specific fields
  knownFor?: Array<{ title: string; year?: string; role?: string; rating?: string }>;
  filmography?: Array<{ title: string; year?: string; role?: string; type?: string }>;
  awards?: Array<{ name: string; year?: string; category?: string }>;
  personalDetails?: {
    birthYear?: string;
    birthPlace?: string;
    height?: string;
    relatives?: Array<{ name: string; relationship: string }>;
  };
  trivia?: string[];
  biography?: string;
  confidence: number;
  sourceUrl: string;
  generatedAt: string;
}

export class WebScrapingService {
  private static readonly SCRAPINGBEE_KEY = 'scrapingbee_api_key';

  static saveScrapingBeeApiKey(apiKey: string) {
    localStorage.setItem(this.SCRAPINGBEE_KEY, apiKey);
  }

  static getScrapingBeeApiKey(): string | null {
    return localStorage.getItem(this.SCRAPINGBEE_KEY);
  }

  private static readonly SCRAPING_METHODS = {
    // Method 1: ScrapingBee API (Primary)
    scrapingBee: async (url: string): Promise<string> => {
      const apiKey = WebScrapingService.getScrapingBeeApiKey();
      if (!apiKey) throw new Error('ScrapingBee API key not set');
      
      console.log(`Trying ScrapingBee API for: ${url}`);
      
      try {
        const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(url)}&render_js=false&premium_proxy=false&timeout=15000`;
        
        const response = await fetch(scrapingBeeUrl, {
          method: 'GET',
          timeout: 20000
        });
        
        if (response.ok) {
          const content = await response.text();
          if (content && content.length > 100) {
            console.log(`✅ ScrapingBee successful! Content length: ${content.length}`);
            return content;
          } else {
            throw new Error('ScrapingBee returned empty or insufficient content');
          }
        } else {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`ScrapingBee failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
      } catch (error) {
        console.error('ScrapingBee error:', error);
        throw error instanceof Error ? error : new Error('ScrapingBee request failed');
      }
    },

    // Method 2: Direct fetch with headers rotation
    directFetch: async (url: string): Promise<string> => {
      const headers = [
        { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      ];
      
      for (const header of headers) {
        try {
          console.log(`Trying direct fetch with user agent...`);
          const response = await fetch(url, { 
            headers: header,
            mode: 'cors'
          });
          if (response.ok) {
            const content = await response.text();
            console.log(`✅ Direct fetch successful!`);
            return content;
          }
        } catch (e) { 
          console.log(`❌ Direct fetch attempt failed, trying next header...`);
          continue; 
        }
      }
      throw new Error('Direct fetch failed with all headers');
    },

    // Method 3: CORS proxy with multiple endpoints
    corsProxy: async (url: string): Promise<string> => {
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
          const response = await fetch(proxy.url + encodeURIComponent(url));
          if (response.ok) {
            const data = proxy.isJson ? await response.json() : await response.text();
            const content = proxy.parseResponse(data);
            if (content && content.length > 100) {
              console.log(`✅ CORS proxy successful!`);
              return content;
            }
          }
        } catch (e) { 
          console.log(`❌ CORS proxy attempt failed, trying next...`);
          continue; 
        }
      }
      throw new Error('CORS proxy failed with all endpoints');
    },

    // Method 4: IMDB-specific extraction using their API patterns
    imdbSpecific: async (url: string): Promise<string> => {
      const imdbId = url.match(/nm(\d+)/)?.[1];
      if (!imdbId) throw new Error('Invalid IMDB URL format');
      
      console.log(`Trying IMDB-specific extraction for ID: nm${imdbId}`);
      
      // Try IMDB's public endpoints with different formats
      const endpoints = [
        `https://www.imdb.com/name/nm${imdbId}/`,
        `https://m.imdb.com/name/nm${imdbId}/`,
        `https://imdb.com/name/nm${imdbId}/`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const result = await WebScrapingService.SCRAPING_METHODS.directFetch(endpoint);
          if (result && result.length > 1000) {
            console.log(`✅ IMDB-specific extraction successful!`);
            return result;
          }
        } catch (e) {
          continue;
        }
      }
      
      throw new Error(`IMDB-specific extraction failed for nm${imdbId}`);
    }
  };

  // Bulletproof scraping function with ScrapingBee as primary
  private static async scrapeWithFallbacks(url: string): Promise<string> {
    const methods = [
      () => WebScrapingService.SCRAPING_METHODS.scrapingBee(url),
      () => WebScrapingService.SCRAPING_METHODS.imdbSpecific(url),
      () => WebScrapingService.SCRAPING_METHODS.directFetch(url), 
      () => WebScrapingService.SCRAPING_METHODS.corsProxy(url)
    ];
    
    let lastError: Error | undefined;
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`🔄 Attempting scraping method ${i + 1}/${methods.length}...`);
        const result = await methods[i]();
        
        // Validate the result has meaningful content
        if (result && result.length > 100) {
          console.log(`✅ Scraping successful with method ${i + 1}!`);
          return result;
        } else {
          throw new Error('Insufficient content retrieved');
        }
      } catch (error) {
        lastError = error as Error;
        console.log(`❌ Method ${i + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}. Trying next method...`);
        continue;
      }
    }
    
    throw new Error(`All scraping methods failed. Last error: ${lastError?.message}`);
  }

  static async scrapeUrl(url: string): Promise<{ success: boolean; content?: string; error?: string }> {
    try {
      console.log(`🚀 Starting bulletproof scraping for: ${url}`);
      const content = await WebScrapingService.scrapeWithFallbacks(url);
      
      console.log(`✅ Scraping completed successfully! Content length: ${content.length}`);
      return { success: true, content };
    } catch (error) {
      console.error('❌ All scraping methods failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape URL with all methods',
      };
    }
  }
}

export class LLMService {
  private static GEMINI_KEY = 'gemini_api_key';

  static saveGeminiApiKey(apiKey: string) {
    localStorage.setItem(this.GEMINI_KEY, apiKey);
  }

  static getGeminiApiKey(): string | null {
    return localStorage.getItem(this.GEMINI_KEY);
  }

  static async extractPersonProfile(sourceUrl: string, rawContent: string): Promise<PersonProfile> {
    const geminiKey = this.getGeminiApiKey();
    
    // If no Gemini key, return basic scraped profile
    if (!geminiKey) {
      return this.createBasicProfile(sourceUrl, rawContent);
    }

    // Clean and truncate content to keep request size reasonable
    const cleanContent = rawContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 30000);

    const prompt = `Extract profile data from this webpage content and return as JSON with fields: name, jobTitle, company, location, description, skills, projects, experience, confidence. 

Instructions:
- Return ONLY valid JSON that strictly follows this TypeScript type (no markdown, no explanation):
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
  "generatedAt": "${new Date().toISOString()}"
}
- Extract person-specific information only
- Skills should be relevant professional skills/technologies
- Confidence should be 0.0-1.0 based on data completeness and reliability
- Return empty strings for missing required fields, omit optional fields if not found

SOURCE URL: ${sourceUrl}

WEBPAGE CONTENT:
${cleanContent}`;

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Gemini API error: ${resp.status} ${text}`);
    }

    const data = await resp.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;

    let parsed: PersonProfile;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse LLM JSON:', jsonText);
      throw new Error('Failed to parse AI response');
    }

    // Ensure required fields
    parsed.sourceUrl = parsed.sourceUrl || sourceUrl;
    parsed.generatedAt = parsed.generatedAt || new Date().toISOString();
    if (typeof parsed.confidence !== 'number') parsed.confidence = 0.5;

    return parsed;
  }

  // Create comprehensive profile from scraped IMDB content without AI
  static createBasicProfile(sourceUrl: string, rawContent: string): PersonProfile {
    const cleanContent = rawContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Extract name from title or structured data
    let name = '';
    const titleMatch = rawContent.match(/<title[^>]*>([^<]+)/i);
    if (titleMatch) {
      name = titleMatch[1].replace(/ - IMDb.*$/i, '').trim();
    }
    
    // Fallback name extraction from JSON-LD
    const jsonLdMatch = rawContent.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/is);
    if (jsonLdMatch && !name) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        if (jsonData.mainEntity?.name) {
          name = jsonData.mainEntity.name;
        } else if (jsonData.name) {
          name = jsonData.name;
        }
      } catch {}
    }

    // Extract job title/profession
    let jobTitle = '';
    const professionMatch = cleanContent.match(/(?:Actor|Director|Producer|Writer|Composer|Cinematographer|Editor)/i);
    if (professionMatch) {
      jobTitle = professionMatch[0];
    }

    // Extract image from meta tags or JSON-LD
    let image = '';
    const imageMatch = rawContent.match(/property="og:image"[^>]*content="([^"]+)"/i) ||
                     rawContent.match(/"image":"([^"]+)"/i);
    if (imageMatch) {
      image = imageMatch[1];
    }

    // Extract "Known For" section
    const knownFor: Array<{ title: string; year?: string; role?: string; rating?: string }> = [];
    const knownForMatches = rawContent.matchAll(/Known for[^]*?<a[^>]*>([^<]+)<\/a>[^]*?(\d{4})/gi);
    for (const match of knownForMatches) {
      knownFor.push({
        title: match[1].trim(),
        year: match[2],
        role: jobTitle
      });
    }

    // Extract filmography/credits
    const filmography: Array<{ title: string; year?: string; role?: string; type?: string }> = [];
    const creditMatches = rawContent.matchAll(/<a[^>]*href="\/title\/[^"]*"[^>]*>([^<]+)<\/a>[^]*?(\d{4})[^]*?(Actor|Director|Producer|Writer)/gi);
    for (const match of creditMatches) {
      filmography.push({
        title: match[1].trim(),
        year: match[2],
        role: match[3],
        type: 'movie'
      });
    }

    // Extract personal details
    const personalDetails: any = {};
    
    // Birth year
    const birthMatch = rawContent.match(/Born[^]*?(\d{4})/i) || 
                      rawContent.match(/"birthDate":"(\d{4})/i);
    if (birthMatch) {
      personalDetails.birthYear = birthMatch[1];
    }

    // Height
    const heightMatch = rawContent.match(/Height[^]*?(\d+[′']?\s*\d*[″"]?|\d+\.\d+\s*m)/i);
    if (heightMatch) {
      personalDetails.height = heightMatch[1];
    }

    // Relatives (especially for actors with famous family)
    const relatives: Array<{ name: string; relationship: string }> = [];
    const relativeMatches = rawContent.matchAll(/(?:Parents?|Mother|Father|Grandfather|Grandmother)[^]*?<a[^>]*>([^<]+)<\/a>/gi);
    for (const match of relativeMatches) {
      const name = match[1].trim();
      if (name && !relatives.find(r => r.name === name)) {
        relatives.push({
          name,
          relationship: match[0].toLowerCase().includes('parent') ? 'Parent' : 
                      match[0].toLowerCase().includes('mother') ? 'Mother' :
                      match[0].toLowerCase().includes('father') ? 'Father' :
                      match[0].toLowerCase().includes('grandfather') ? 'Grandfather' :
                      match[0].toLowerCase().includes('grandmother') ? 'Grandmother' : 'Relative'
        });
      }
    }
    personalDetails.relatives = relatives;

    // Extract trivia
    const trivia: string[] = [];
    const triviaMatches = rawContent.matchAll(/Trivia[^]*?<\/h4>[^]*?<div[^>]*>(.*?)<\/div>/gis);
    for (const match of triviaMatches) {
      const triviaText = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (triviaText && triviaText.length > 10) {
        trivia.push(triviaText.slice(0, 200));
      }
    }

    // Extract biography/description
    let biography = '';
    const bioMatch = rawContent.match(/Biography[^]*?<p[^>]*>(.*?)<\/p>/is) ||
                    rawContent.match(/mini-bio[^]*?<p[^>]*>(.*?)<\/p>/is);
    if (bioMatch) {
      biography = bioMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);
    }

    // Extract ratings for known works
    const ratingMatches = rawContent.matchAll(/(\d\.\d)\s*\/\s*10/g);
    let ratingIndex = 0;
    knownFor.forEach(work => {
      if (ratingIndex < Array.from(ratingMatches).length) {
        work.rating = Array.from(ratingMatches)[ratingIndex]?.[1];
        ratingIndex++;
      }
    });

    return {
      name: name || 'Unknown',
      jobTitle: jobTitle || 'Entertainment Professional',
      company: 'Entertainment Industry',
      location: personalDetails.birthPlace || '',
      description: biography || `${name} is ${jobTitle?.toLowerCase() || 'an entertainment professional'} known for various projects in the film industry.`,
      skills: jobTitle ? [jobTitle, 'Acting', 'Performance'] : ['Entertainment'],
      image,
      knownFor: knownFor.length > 0 ? knownFor : undefined,
      filmography: filmography.length > 0 ? filmography.slice(0, 20) : undefined, // Limit to top 20
      personalDetails: Object.keys(personalDetails).length > 0 ? personalDetails : undefined,
      trivia: trivia.length > 0 ? trivia.slice(0, 5) : undefined, // Top 5 trivia
      biography: biography || undefined,
      confidence: 0.8, // Higher confidence for comprehensive extraction
      sourceUrl,
      generatedAt: new Date().toISOString()
    };
  }
}