import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LLMService, WebScrapingService } from '@/utils/LLMService';

export const ApiKeySettings: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>(LLMService.getGeminiApiKey() || '');
  const [scrapingBeeKey, setScrapingBeeKey] = useState<string>(WebScrapingService.getScrapingBeeApiKey() || '');

  const handleSave = async () => {
    if (geminiKey) LLMService.saveGeminiApiKey(geminiKey);
    if (scrapingBeeKey) WebScrapingService.saveScrapingBeeApiKey(scrapingBeeKey);
    
    toast({ 
      title: 'Saved', 
      description: 'API keys saved locally (browser only).' 
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">API Key</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="api-config-description">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
        </DialogHeader>
        <div id="api-config-description" className="sr-only">
          Configure your API keys for enhanced profile generation. ScrapingBee provides reliable web scraping, while Gemini enables AI-powered content extraction.
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scrapingbee">ScrapingBee API Key (Primary)</Label>
            <Input 
              id="scrapingbee" 
              type="password"
              value={scrapingBeeKey} 
              onChange={(e) => setScrapingBeeKey(e.target.value)} 
              placeholder="YOUR_SCRAPINGBEE_API_KEY" 
            />
            <p className="text-sm text-muted-foreground">
              Primary scraping service with high reliability. Get your key from{' '}
              <a href="https://app.scrapingbee.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                ScrapingBee Dashboard
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gemini">Gemini API Key</Label>
            <Input 
              id="gemini" 
              type="password"
              value={geminiKey} 
              onChange={(e) => setGeminiKey(e.target.value)} 
              placeholder="AIzaSy..." 
            />
            <p className="text-sm text-muted-foreground">
              Required for AI-powered profile extraction. Get your free key from{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Google AI Studio
              </a>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Key is stored in your browser (localStorage) for demo purposes. For production, use a backend or Supabase Edge Functions.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};