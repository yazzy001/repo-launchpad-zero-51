import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WebScrapingService } from '@/utils/LLMService';

export const ScrapingBeeTest: React.FC = () => {
  const [testUrl, setTestUrl] = useState('https://www.imdb.com/name/nm0000138/'); // Eden Brolin
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testScrapingBee = async () => {
    setIsLoading(true);
    setError('');
    setTestResult('');

    try {
      console.log('🧪 Testing ScrapingBee API...');
      
      // Test API key
      const apiKey = WebScrapingService.getScrapingBeeApiKey();
      console.log(`🔑 API Key: ${apiKey ? 'Present' : 'Missing'}`);
      
      if (!apiKey) {
        throw new Error('Please set ScrapingBee API key first');
      }

      // Test direct API call
      const scrapingBeeUrl = new URL('https://app.scrapingbee.com/api/v1/');
      scrapingBeeUrl.searchParams.append('api_key', apiKey);
      scrapingBeeUrl.searchParams.append('url', testUrl);
      scrapingBeeUrl.searchParams.append('render_js', 'false');
      scrapingBeeUrl.searchParams.append('premium_proxy', 'true');
      scrapingBeeUrl.searchParams.append('timeout', '15000');

      console.log(`🔗 Request URL: ${scrapingBeeUrl.toString()}`);

      const response = await fetch(scrapingBeeUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const content = await response.text();
        console.log(`📄 Content length: ${content.length}`);
        
        setTestResult(`✅ SUCCESS! 
Status: ${response.status}
Content Length: ${content.length}
Preview: ${content.substring(0, 500)}...`);
      } else {
        const errorText = await response.text().catch(() => 'No error details');
        console.error(`❌ Error response: ${errorText}`);
        setError(`❌ HTTP ${response.status}: ${response.statusText}\n${errorText}`);
      }

    } catch (err: any) {
      console.error('🧪 Test failed:', err);
      setError(`❌ Test failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🧪 ScrapingBee API Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Test URL:</label>
          <Input 
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter IMDB URL to test"
          />
        </div>

        <Button 
          onClick={testScrapingBee}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '🔄 Testing...' : '🧪 Test ScrapingBee API'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-xs">{error}</pre>
            </AlertDescription>
          </Alert>
        )}

        {testResult && (
          <Alert>
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-xs">{testResult}</pre>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Debug Info:</strong></p>
          <p>API Key: {WebScrapingService.getScrapingBeeApiKey() ? '✅ Set' : '❌ Missing'}</p>
          <p>Check browser console for detailed logs</p>
        </div>
      </CardContent>
    </Card>
  );
};
