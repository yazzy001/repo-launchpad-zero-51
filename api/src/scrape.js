/*
const axios = require('axios');
const cheerio = require('cheerio');

// Fetches a URL and returns Cheerio-loaded HTML document
async function loadPage(url) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };

  // Add specific headers for IMDB
  if (url.includes('imdb.com')) {
    headers['Referer'] = 'https://www.imdb.com/';
    headers['Cache-Control'] = 'no-cache';
  }

  const response = await axios.get(url, { 
    timeout: 15000,
    headers,
    maxRedirects: 5,
    validateStatus: (status) => status < 400
  });
  
  return cheerio.load(response.data);
}

// Extract all JSON-LD structured data scripts from the page
function extractJsonLd($) {
  const jsonLdData = [];
  $('script[type="application/ld+json"]').each((i, element) => {
    try {
      const jsonText = $(element).html();
      const data = JSON.parse(jsonText);
      jsonLdData.push(data);
    } catch (e) {
      console.error('Error parsing JSON-LD:', e);
    }
  });
  return jsonLdData;
}

// Extract main textual content from the page (excluding headers/footers/nav)
function extractMainText($) {
  // Remove irrelevant sections (scripts, style, nav, footer, etc.)
  $('script, style, nav, header, footer').remove();
  let text = '';
  if ($('main').length > 0) {
    text = $('main').text();
  } else {
    text = $('body').text();
  }
  // Collapse whitespace and trim
  return text.replace(/\s+/g, ' ').trim();
}

// Scrape a page: returns an object with text content and JSON-LD data
async function scrapePage(url) {
  try {
    const $ = await loadPage(url);
    const jsonLd = extractJsonLd($);    // structured data (if any):contentReference[oaicite:3]{index=3}
    const textContent = extractMainText($);
    return {
      url,
      textContent,
      jsonLd   // array of JSON-LD objects (could be empty if none found)
    };
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return null;
  }
}

module.exports = { scrapePage };
*/



/*
// src/scrape.js
const axios = require('axios');
const cheerio = require('cheerio');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function loadPage(url) {
  const res = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8',
      Referer: 'https://www.google.com/'
    },
    // follow redirects by default
    maxRedirects: 5,
    validateStatus: s => s >= 200 && s < 400
  });
  return cheerio.load(res.data);
}

function extractJsonLd($) {
  const jsonLdData = [];
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const raw = $(el).contents().text().trim();
      if (!raw) return;
      // Some sites embed arrays or multiple objects; wrap parse in try/catch
      const parsed = JSON.parse(raw);
      jsonLdData.push(parsed);
    } catch {
      // ignore broken blocks
    }
  });
  return jsonLdData;
}

function extractMainText($) {
  $('script, style, nav, header, footer, noscript').remove();
  const root = $('main').length ? $('main') : $('body');
  return root.text().replace(/\s+/g, ' ').trim();
}

// --- Site-specific helpers (best-effort) ---
function sniffImage($, url) {
  // JSON-LD Person.image first
  const jld = extractJsonLd($).flat();
  const asArray = Array.isArray(jld) ? jld : [jld];
  for (const blk of asArray) {
    if (blk && blk['@type'] === 'Person' && blk.image) {
      if (typeof blk.image === 'string') return blk.image;
      if (blk.image?.contentUrl) return blk.image.contentUrl;
      if (Array.isArray(blk.image) && blk.image[0]?.contentUrl) return blk.image[0].contentUrl;
    }
  }

  // IMDb profile image
  if (/imdb\.com\/name\//i.test(url)) {
    const img = $('img.ipc-image').first().attr('src');
    if (img) return img;
  }

  // Wikipedia infobox image
  if (/wikipedia\.org\/wiki\//i.test(url)) {
    const img = $('table.infobox img').first().attr('src');
    if (img) return img.startsWith('http') ? img : `https:${img}`;
  }

  // LinkedIn public (very limited HTML); try og:image
  const og = $('meta[property="og:image"]').attr('content');
  if (og) return og;

  return null;
}

function sniffCredits($, url) {
  const credits = [];

  // IMDb: Known for tiles
  if (/imdb\.com\/name\//i.test(url)) {
    $('a[href*="/title/"]').each((_, el) => {
      const $el = $(el);
      const title = $el.text().trim();
      const href = $el.attr('href') || '';
      if (title && /\/title\/tt/.test(href)) {
        credits.push({
          '@type': 'CreativeWork',
          name: title,
          url: `https://www.imdb.com${href.split('?')[0]}`
        });
      }
    });
  }

  // Wikipedia: filmography tables (very rough)
  if (/wikipedia\.org\/wiki\//i.test(url)) {
    $('table.wikitable tr').each((_, tr) => {
      const cells = $(tr).find('td,th');
      if (cells.length >= 2) {
        const maybeYear = $(cells[0]).text().trim();
        const maybeTitle = $(cells[1]).text().trim();
        if (/\d{4}/.test(maybeYear) && maybeTitle) {
          credits.push({
            '@type': 'CreativeWork',
            name: maybeTitle,
            startDate: maybeYear
          });
        }
      }
    });
  }

  // LinkedIn doesn’t expose film credits; we’ll rely on Gemini + secondary sources.
  return dedupeCredits(credits).slice(0, 50);
}

function dedupeCredits(list) {
  const seen = new Set();
  const out = [];
  for (const it of list) {
    const key = (it.name || '') + '|' + (it.url || '') + '|' + (it.startDate || '');
    if (key.trim() && !seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

// Main scrape function
async function scrapePage(url) {
  try {
    const $ = await loadPage(url);
    const jsonLd = extractJsonLd($);
    const textContent = extractMainText($);
    const image = sniffImage($, url);
    const credits = sniffCredits($, url);

    return {
      url,
      textContent,
      jsonLd,     // array
      image,      // string | null
      credits     // array of CreativeWork
    };
  } catch (err) {
    console.error(`Failed to scrape ${url}:`, err.message);
    return null;
  }
}

module.exports = { scrapePage };
*/
// src/scrape.js
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function loadPage(url) {
  const res = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    // follow redirects by default
    maxRedirects: 5,
    validateStatus: (s) => s >= 200 && s < 400,
  });
  return cheerio.load(res.data);
}

function extractJsonLd($) {
  const out = [];
  $('script[type="application/ld+json"]').each((i, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      // pages sometimes have arrays or multiple objects in one tag
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch (_) {}
  });
  return out;
}

function extractMeta($) {
  const pick = (sel, attr) => ($(sel).attr(attr) || '').trim();
  return {
    ogTitle: pick('meta[property="og:title"]', 'content'),
    ogDesc: pick('meta[property="og:description"]', 'content'),
    ogImage: pick('meta[property="og:image"]', 'content'),
    twitterTitle: pick('meta[name="twitter:title"]', 'content'),
    twitterDesc: pick('meta[name="twitter:description"]', 'content'),
    twitterImage: pick('meta[name="twitter:image"]', 'content') || pick('meta[name="twitter:image:src"]', 'content'),
  };
}

function extractMainText($) {
  $('script, style, nav, header, footer, noscript').remove();
  const main = $('main').text() || $('article').text() || $('body').text();
  return (main || '').replace(/\s+/g, ' ').trim();
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

/* ---------- DOMAIN PARSERS ---------- */

// 1) LinkedIn public profile (best-effort for public, non-auth pages)
function parseLinkedInPublicProfile($, url, jsonLd, meta) {
  // LinkedIn public pages sometimes expose JSON-LD with Person
  let personBlock = jsonLd.find(j => (j['@type'] === 'Person' || (Array.isArray(j['@type']) && j['@type'].includes('Person'))));
  const image =
    (typeof personBlock?.image === 'string' && personBlock.image) ||
    personBlock?.image?.contentUrl ||
    meta.ogImage ||
    meta.twitterImage ||
    null;

  const name = personBlock?.name ||
    $('h1').first().text().trim() ||
    (meta.ogTitle || '').split(' - ')[0];

  // Headline and location hints
  const headline =
    personBlock?.jobTitle ||
    $('div.text-body-medium').first().text().trim() ||
    meta.ogDesc ||
    meta.twitterDesc ||
    '';

  return {
    source: 'linkedin',
    person: {
      name: name || null,
      image: image || null,
      jobTitle: headline || null,
      sameAs: [url],
    },
  };
}

// 2) IMDb comprehensive person page parser
function parseImdbNamePage($, url) {
  console.log('🎬 Starting IMDB scraping for:', url);
  const result = { source: 'imdb' };
  
  try {
    // Extract person information with comprehensive selectors
    const person = {};
    
    // Name extraction - Updated for current IMDB layout (2024)
    person.name = 
      $('h1[data-testid="hero__pageTitle"] span.hero__primary-text').text().trim() ||
      $('h1 span.hero__primary-text').text().trim() ||
      $('h1.header span[itemprop="name"]').text().trim() ||
      $('h1.titleHeader .titleHeader-title').text().trim() ||
      $('h1').first().text().trim() ||
      $('.name-overview-widget h1').text().trim() ||
      null;

    console.log('📝 Extracted name:', person.name);

    // Image extraction - Multiple fallbacks for different layouts
    person.image = 
      $('img[data-testid="hero-media__poster"]').attr('src') ||
      $('div[data-testid="hero-media"] img').attr('src') ||
      $('img.ipc-image').first().attr('src') ||
      $('img#name-poster').attr('src') ||
      $('img.poster').attr('src') ||
      $('.name-poster img').attr('src') ||
      $('.media_index_thumb_list img').first().attr('src') ||
      null;

    // Clean up image URL (remove resize parameters for better quality)
    if (person.image) {
      person.image = person.image.split('._V1_')[0] + '._V1_SX300.jpg';
    }

    console.log('🖼️ Extracted image:', person.image ? 'Found' : 'Not found');

    // Bio/Description extraction - Enhanced for complete artist information
    let fullBio = 
      $('[data-testid="biography-section"] [data-testid="sub-section-biography"]').text().trim() ||
      $('[data-testid="biography-section"] .ipc-html-content-inner-div').text().trim() ||
      $('#bio_content .soda.odd').text().trim() ||
      $('#bio_content .text').text().trim() ||
      $('.bio').text().trim() ||
      $('.name-trivia-bio-text .inline').text().trim() ||
      null;

    // Always try to get complete biography from /bio page for better quality
    try {
      // Construct bio URL from current URL
      const nameMatch = url.match(/\/name\/(nm\d+)/);
      if (nameMatch) {
        const bioUrl = `https://www.imdb.com/name/${nameMatch[1]}/bio/`;
        console.log('🔍 Fetching complete biography from:', bioUrl);
        
        const bioResponse = await axios.get(bioUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.imdb.com/',
          },
          timeout: 15000,
          responseEncoding: 'utf8'
        });
        
        const bio$ = cheerio.load(bioResponse.data);
        
        // Extract complete biography with comprehensive selectors
        let completeBio = '';
        
        // Try multiple approaches to get the full biography
        const bioSections = [];
        
        // Method 1: Get all .soda paragraphs (main biography content)
        bio$('#bio_content .soda').each((i, el) => {
          const text = bio$(el).text().trim();
          if (text && text.length > 10) {
            bioSections.push(text);
          }
        });
        
        // Method 2: If no .soda, try other selectors
        if (bioSections.length === 0) {
          const fallbackSelectors = [
            '[data-testid="biography-text"]',
            '.bio-text',
            '#bio_content p',
            '.ipc-html-content-inner-div p',
            '.biography p'
          ];
          
          for (const selector of fallbackSelectors) {
            bio$(selector).each((i, el) => {
              const text = bio$(el).text().trim();
              if (text && text.length > 20) {
                bioSections.push(text);
              }
            });
            if (bioSections.length > 0) break;
          }
        }
        
        // Method 3: If still nothing, get all text from bio_content
        if (bioSections.length === 0) {
          const allText = bio$('#bio_content').text().trim();
          if (allText && allText.length > 50) {
            bioSections.push(allText);
          }
        }
        
        // Join all sections with proper spacing
        completeBio = bioSections.join('\n\n');
        
        if (completeBio && completeBio.length > 50) {
          // Clean up the biography text
          fullBio = completeBio
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .replace(/â€™/g, "'")   // Fix smart quotes
            .replace(/â€œ/g, '"')   // Fix smart quotes
            .replace(/â€/g, '"')    // Fix smart quotes
            .replace(/â€¢/g, '•')   // Fix bullet points
            .replace(/â€"/g, '—')   // Fix em dashes
            .replace(/â€"/g, '–')   // Fix en dashes
            .replace(/Ã©/g, 'é')    // Fix accented characters
            .replace(/Ã¡/g, 'á')    // Fix accented characters
            .replace(/Ã­/g, 'í')    // Fix accented characters
            .replace(/Ã³/g, 'ó')    // Fix accented characters
            .replace(/Ãº/g, 'ú')    // Fix accented characters
            .replace(/Ã±/g, 'ñ')    // Fix accented characters
            .trim();
          console.log('✅ Retrieved complete biography:', fullBio.length, 'characters');
        } else {
          console.log('⚠️ Bio page found but content was empty or too short');
        }
      }
    } catch (error) {
      console.log('⚠️ Could not fetch complete biography:', error.message);
      // Fall back to original bio if available
    }
    
    // Final cleanup for any remaining encoding issues
    if (fullBio) {
      fullBio = fullBio
        .replace(/[\u0080-\u00FF]/g, (match) => {
          // Convert common problematic characters
          const charMap = {
            'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú', 'Ã±': 'ñ',
            'Ã ': 'à', 'Ã¨': 'è', 'Ã¬': 'ì', 'Ã²': 'ò', 'Ã¹': 'ù',
            'â€™': "'", 'â€œ': '"', 'â€': '"', 'â€¢': '•', 'â€"': '—', 'â€"': '–'
          };
          return charMap[match] || match;
        })
        // Fix HTML entities
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#34;/g, '"')
        .replace(/&#x22;/g, '"')
        .replace(/&#38;/g, '&')
        .replace(/&#x26;/g, '&')
        .replace(/&#60;/g, '<')
        .replace(/&#62;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    person.description = fullBio;
    console.log('📖 Extracted bio:', person.description ? `Found (${person.description.length} chars)` : 'Not found');

    // Birth date and place - Enhanced selectors with proper parsing
    const birthInfo = 
      $('li:contains("Born")').text().trim() ||
      $('[data-testid="birth-date"]').text().trim() ||
      $('time[itemprop="birthDate"]').attr('datetime') ||
      $('#name-born-info time').text().trim() ||
      $('.name-born-info time').text().trim() ||
      null;

    // Parse birth date properly - extract actual date/year
    if (birthInfo) {
      console.log('📅 Raw birth info:', birthInfo);
      // Look for date patterns like "April 18, 1994" or just "1994"
      const fullDateMatch = birthInfo.match(/(\w+\s+\d{1,2},?\s+\d{4})/);
      if (fullDateMatch) {
        person.birthDate = fullDateMatch[1];
      } else {
        // Try to extract just year if full date not found
        const yearMatch = birthInfo.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          person.birthDate = yearMatch[0];
        }
      }
      
      // Extract birth place (usually after the date)
      const placeMatch = birthInfo.match(/\d{4}[,\s]+(.+)/);
      if (placeMatch) {
        person.birthPlace = placeMatch[1].trim();
      }
    }

    // Fallback birth place extraction
    if (!person.birthPlace) {
      person.birthPlace = 
        $('[data-testid="birth-place"]').text().trim() ||
        $('[itemprop="birthPlace"]').text().trim() ||
        $('#name-born-info a').last().text().trim() ||
        $('.name-born-info a').last().text().trim() ||
        null;
    }

    console.log('📅 Parsed birth date:', person.birthDate);
    console.log('📍 Parsed birth place:', person.birthPlace);

    // Job titles/professions - Enhanced extraction
    const jobTitles = [];
    $('[data-testid="hero-profession-items"] a, .name-job-categories a, .name-job-categories span').each((i, el) => {
      const job = $(el).text().trim();
      if (job && !jobTitles.includes(job)) jobTitles.push(job);
    });
    
    // Fallback for job titles
    if (!jobTitles.length) {
      const heroText = $('[data-testid="hero-title-block__metadata"]').text();
      if (heroText) {
        const jobs = heroText.split('•').map(s => s.trim()).filter(s => s && s.length < 50);
        jobTitles.push(...jobs);
      }
    }
    
    person.jobTitle = jobTitles.join(', ') || null;

    console.log('💼 Extracted job titles:', person.jobTitle);

    // Known for section - Enhanced
    const knownFor = [];
    $('[data-testid="knownfor-section"] [data-testid="knownfor-item"], .knownfor-item').each((i, el) => {
      const $el = $(el);
      const title = $el.find('[data-testid="knownfor-item-title"], .knownfor-item-title, a').first().text().trim();
      const year = $el.find('[data-testid="knownfor-item-year"], .knownfor-item-year').text().trim().replace(/[()]/g, '');
      const role = $el.find('[data-testid="knownfor-item-character"], .knownfor-item-character').text().trim();
      const href = $el.find('a[href*="/title/"]').attr('href');
      
      if (title) {
        knownFor.push({
          title,
          year: year || null,
          role: role || null,
          url: href ? `https://www.imdb.com${href.split('?')[0]}` : null
        });
      }
    });

    console.log('⭐ Extracted known for items:', knownFor.length);

    // Extract comprehensive filmography with enhanced selectors
  const credits = [];
    
    // Modern IMDB layout (2024)
    $('[data-testid="filmography-section"], .filmography-section').each((sectionIndex, section) => {
      const $section = $(section);
      const department = $section.find('h3, [data-testid="filmography-section-title"], .filmography-section-title').first().text().trim() || 'Unknown';
      
      console.log(`🎭 Processing filmography section: ${department}`);
      
      $section.find('[data-testid="filmography-item"], .filmography-item, .filmo-row').each((i, el) => {
    const $el = $(el);
        const title = $el.find('[data-testid="title"], .title a, b a').first().text().trim();
        const year = $el.find('[data-testid="year"], .year_column, .year').text().trim().replace(/[()]/g, '');
        const role = $el.find('[data-testid="characters"], .character, .characters').text().trim();
        const href = $el.find('a[href*="/title/"]').attr('href');
        
    if (title) {
      credits.push({
        title,
        year: year || null,
        role: role || null,
            department: department,
            url: href ? `https://www.imdb.com${href.split('?')[0]}` : null,
            type: 'film'
          });
        }
      });
    });

    // Fallback: Legacy IMDB markup
  if (!credits.length) {
      console.log('🔄 Using legacy IMDB markup fallback');
      $('#filmography .filmo-row, .filmography .filmo-row').each((i, el) => {
      const $el = $(el);
        const title = $el.find('b a, .title a').text().trim();
        const year = $el.find('.year_column, .year').text().trim().replace(/[()]/g, '');
        const roleText = $el.text();
        const role = roleText.includes('...') ? roleText.split('...')[1]?.split('(')[0]?.trim() : '';
        const dept = $el.attr('id')?.split('-')[0] || 
                    $el.closest('[id*="filmography"]').attr('id')?.replace('filmography-', '') || 
                    'Credit';
        const href = $el.find('b a, .title a').attr('href');
        
      if (title) {
        credits.push({
          title,
          year: year || null,
          role: role || null,
            department: dept.charAt(0).toUpperCase() + dept.slice(1),
            url: href ? `https://www.imdb.com${href.split('?')[0]}` : null,
            type: 'film'
        });
      }
    });
  }

    // Additional fallback: Use "Known For" if no filmography found
    if (!credits.length && knownFor.length) {
      console.log('🔄 Using Known For as credits fallback');
      credits.push(...knownFor.map(item => ({
        title: item.title,
        year: item.year,
        role: item.role,
        department: 'Known For',
        url: item.url,
        type: 'film'
      })));
    }

    console.log(`🎬 Extracted ${credits.length} credits`);

    // Awards and nominations - Enhanced
    const awards = [];
    $('[data-testid="awards-section"] li, .awards li, .award').each((i, el) => {
      const award = $(el).text().trim();
      if (award && award.length > 5) awards.push(award);
    });

    // Personal details - Enhanced with better parsing
    const personalDetails = {};
    
    // Height extraction with proper parsing
    const heightSelectors = [
      'li:contains("Height")',
      '[data-testid="details-section"] li:contains("Height")',
      '.personal-details li:contains("Height")',
      '.name-personal-details li:contains("Height")'
    ];
    
    for (const selector of heightSelectors) {
      const heightEl = $(selector).first();
      if (heightEl.length) {
        const heightText = heightEl.text().trim();
        console.log('📏 Raw height text:', heightText);
        
        // Extract height in format like "5′ 7″" or "5'7"" or "170 cm"
        const heightMatch = heightText.match(/(\d+)\s*[′']\s*(\d+)\s*[″"]|(\d+)\s*cm/);
        if (heightMatch) {
          if (heightMatch[1] && heightMatch[2]) {
            // Feet and inches format
            personalDetails.height = `${heightMatch[1]}′ ${heightMatch[2]}″`;
          } else if (heightMatch[3]) {
            // Centimeters format
            personalDetails.height = `${heightMatch[3]} cm`;
          }
        }
        break;
      }
    }
    
    // Other personal details
    $('[data-testid="details-section"] li, .personal-details li, .name-personal-details li').each((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      
      if (text.includes('Spouse') && !text.includes('Height')) {
        personalDetails.spouse = text.replace(/Spouse:?/i, '').trim();
      } else if (text.includes('Children') && !text.includes('Height')) {
        personalDetails.children = text.replace(/Children:?/i, '').trim();
      }
    });
    
    console.log('👤 Personal details extracted:', personalDetails);

    // Extract comprehensive media content for artists - Photos, Videos, Trailers
    const mediaContent = {
      photos: [],
      videos: [],
      trailers: []
    };

    console.log('📸 Starting comprehensive media extraction...');

    // Enhanced Photos extraction - Multiple sources
    const photoSelectors = [
      '[data-testid="photos-section"] img',
      '.media_index_thumb_list img',
      '.photos img',
      '.titlereference-section-photos img',
      '.media-viewer img',
      '.ipc-media img',
      '.hero-media img'
    ];

    const seenPhotoUrls = new Set();
    
    for (const selector of photoSelectors) {
      $(selector).each((i, img) => {
        const src = $(img).attr('src');
        if (src && !src.includes('svg') && !src.includes('icon') && mediaContent.photos.length < 20) {
          // Get higher quality version
          let highQualityUrl = src;
          if (src.includes('._V1_')) {
            highQualityUrl = src.split('._V1_')[0] + '._V1_SX800.jpg';
          }
          
          if (!seenPhotoUrls.has(highQualityUrl)) {
            seenPhotoUrls.add(highQualityUrl);
            mediaContent.photos.push({
              url: highQualityUrl,
              alt: $(img).attr('alt') || $(img).attr('title') || 'Photo',
              type: 'image'
            });
          }
        }
      });
    }

    // Enhanced Videos and trailers extraction - Multiple sources
    const videoSelectors = [
      '[data-testid="videos-section"] a',
      '.videos a',
      '.video-list a',
      '.titlereference-section-videos a',
      '.media-viewer-video a',
      'a[href*="/video/"]'
    ];

    const seenVideoUrls = new Set();

    for (const selector of videoSelectors) {
      $(selector).each((i, link) => {
        const href = $(link).attr('href');
        if (href && href.includes('/video/') && mediaContent.videos.length + mediaContent.trailers.length < 15) {
          const videoUrl = href.startsWith('http') ? href : `https://www.imdb.com${href}`;
          
          if (!seenVideoUrls.has(videoUrl)) {
            seenVideoUrls.add(videoUrl);
            
            const title = $(link).find('img').attr('alt') || 
                         $(link).attr('title') || 
                         $(link).text().trim() || 
                         'Video';
            
            const thumbnail = $(link).find('img').attr('src');
            const isTrailer = title.toLowerCase().includes('trailer') || 
                            href.toLowerCase().includes('trailer') ||
                            $(link).text().toLowerCase().includes('trailer');
            
            const videoData = {
              url: videoUrl,
              title: title,
              type: isTrailer ? 'trailer' : 'video',
              thumbnail: thumbnail
            };

            if (isTrailer) {
              mediaContent.trailers.push(videoData);
            } else {
              mediaContent.videos.push(videoData);
            }
          }
        }
      });
    }

    // Try to extract additional photos from the main page if we don't have enough
    if (mediaContent.photos.length < 5) {
      console.log('📸 Extracting additional photos from main page...');
      $('img').each((i, img) => {
        const src = $(img).attr('src');
        if (src && src.includes('imdb.com') && src.includes('._V1_') && 
            !src.includes('svg') && !src.includes('icon') && 
            mediaContent.photos.length < 15) {
          
          const highQualityUrl = src.split('._V1_')[0] + '._V1_SX800.jpg';
          
          if (!seenPhotoUrls.has(highQualityUrl)) {
            seenPhotoUrls.add(highQualityUrl);
            mediaContent.photos.push({
              url: highQualityUrl,
              alt: $(img).attr('alt') || $(img).attr('title') || 'Photo',
              type: 'image'
            });
          }
        }
      });
    }

    // Extract additional filmography details with posters
    const enhancedCredits = credits.map(credit => {
      // Try to get poster/image for each credit
      const creditWithMedia = { ...credit };
      
      // If we have a URL, we could potentially fetch the poster, but for speed we'll skip this
      // Instead, we'll construct likely poster URLs based on IMDB patterns
      if (credit.url && credit.url.includes('/title/')) {
        const titleId = credit.url.match(/title\/(tt\d+)/)?.[1];
        if (titleId) {
          creditWithMedia.titleId = titleId;
          // Note: Actual poster URLs would need to be fetched from the title page
        }
      }
      
      return creditWithMedia;
    });

    console.log(`📸 Extracted media: ${mediaContent.photos.length} photos, ${mediaContent.videos.length} videos, ${mediaContent.trailers.length} trailers`);

    // Assemble the result with enhanced media content
    result.person = person;
    result.credits = enhancedCredits;
    result.knownFor = knownFor;
    result.mediaContent = mediaContent;
    if (awards.length) result.awards = awards;
    if (Object.keys(personalDetails).length) result.personalDetails = personalDetails;

    console.log('✅ IMDB scraping completed successfully');
    console.log(`📊 Results: Name: ${person.name ? '✓' : '✗'}, Bio: ${person.description ? '✓' : '✗'}, Image: ${person.image ? '✓' : '✗'}, Credits: ${credits.length}`);

    return result;

  } catch (error) {
    console.error('❌ IMDB scraping error:', error.message);
    return { 
      source: 'imdb', 
      error: error.message,
      person: { name: null },
      credits: [],
      knownFor: []
    };
  }
}

// 3) Wikipedia filmography/basic credits
function parseWikipediaPersonPage($, url) {
  const credits = [];
  // Try tables with caption "Filmography" / "Selected filmography"
  $('table.wikitable').each((i, table) => {
    const $table = $(table);
    const caption = $table.find('caption').text().toLowerCase();
    if (caption.includes('filmography')) {
      const headers = [];
      $table.find('th').each((i, th) => headers.push($(th).text().trim().toLowerCase()));
      $table.find('tr').each((i, tr) => {
        const tds = $(tr).find('td');
        if (!tds.length) return;
        const row = tds.map((i, td) => $(td).text().trim()).get();
        // naive mapping: year | title | role
        const year = row[0] || null;
        const title = row[1] || null;
        const role = row[2] || null;
        if (title) {
          // attempt to get link
          const linkEl = $(tr).find('td a[href^="/wiki/"]').first();
          const link = linkEl.length ? new URL(linkEl.attr('href'), 'https://en.wikipedia.org').toString() : null;
          credits.push({
            title,
            year,
            role,
            department: null,
            url: link,
            type: null,
          });
        }
      });
    }
  });

  // Try infobox image/name too
  const image =
    $('table.infobox a.image img').attr('src') ? `https:${$('table.infobox a.image img').attr('src')}` : null;

  const name =
    $('h1#firstHeading').text().trim() ||
    $('table.infobox caption').first().text().trim() ||
    null;

  return { source: 'wikipedia', credits, person: { name, image } };
}

/* ---------- MAIN SCRAPE ---------- */

async function scrapePage(url) {
  try {
    const d = domainOf(url);
    const $ = await loadPage(url);
    const jsonLd = extractJsonLd($);
    const meta = extractMeta($);
    const textContent = extractMainText($);

    const domainHints = { domain: d, isLinkedIn: d.includes('linkedin.com'), isImdb: d.includes('imdb.com'), isWikipedia: d.includes('wikipedia.org') };
    const extracted = {};

    if (domainHints.isLinkedIn) Object.assign(extracted, parseLinkedInPublicProfile($, url, jsonLd, meta));
    if (domainHints.isImdb) Object.assign(extracted, parseImdbNamePage($, url));
    if (domainHints.isWikipedia) Object.assign(extracted, parseWikipediaPersonPage($, url));

    return { url, textContent, jsonLd, meta, domainHints, extracted };
  } catch (e) {
    console.error(`Failed to scrape ${url}: ${e.message}`);
    return null;
  }
}

module.exports = { scrapePage };
