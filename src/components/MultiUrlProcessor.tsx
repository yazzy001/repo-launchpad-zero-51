import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, Globe, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UrlSource {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  confidence?: number;
  source?: string;
  data?: any;
}

interface MultiUrlProcessorProps {
  onProcessingComplete: (results: UrlSource[]) => void;
}

export const MultiUrlProcessor: React.FC<MultiUrlProcessorProps> = ({ onProcessingComplete }) => {
  const [urls, setUrls] = useState<UrlSource[]>([{ id: '1', url: '', status: 'pending' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const addUrl = () => {
    const newUrl: UrlSource = {
      id: Date.now().toString(),
      url: '',
      status: 'pending'
    };
    setUrls([...urls, newUrl]);
  };

  const removeUrl = (id: string) => {
    if (urls.length > 1) {
      setUrls(urls.filter(url => url.id !== id));
    }
  };

  const updateUrl = (id: string, value: string) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, url: value } : url
    ));
  };

  const getSourceType = (url: string): string => {
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('imdb.com')) return 'IMDB';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    return 'Website';
  };

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const processUrls = async () => {
    const validUrls = urls.filter(url => url.url && isValidUrl(url.url));
    
    if (validUrls.length === 0) {
      toast({
        title: "No valid URLs",
        description: "Please enter at least one valid URL to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with realistic timing
    const results: UrlSource[] = [];
    const totalUrls = validUrls.length;

    for (let i = 0; i < validUrls.length; i++) {
      const url = validUrls[i];
      
      // Update status to processing
      setUrls(current => current.map(u => 
        u.id === url.id ? { ...u, status: 'processing' as const } : u
      ));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence

      const result: UrlSource = {
        ...url,
        status: success ? 'completed' : 'error',
        confidence: success ? confidence : undefined,
        source: getSourceType(url.url),
        data: success ? {
          name: `Profile from ${getSourceType(url.url)}`,
          extractedData: `Mock data for ${url.url}`
        } : undefined
      };

      results.push(result);
      
      // Update individual URL status
      setUrls(current => current.map(u => 
        u.id === url.id ? result : u
      ));

      // Update progress
      setProgress(((i + 1) / totalUrls) * 100);
    }

    setIsProcessing(false);
    onProcessingComplete(results);

    toast({
      title: "Processing Complete",
      description: `Successfully processed ${results.filter(r => r.status === 'completed').length} out of ${totalUrls} URLs.`,
    });
  };

  const validUrlCount = urls.filter(url => url.url && isValidUrl(url.url)).length;

  return (
    <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden">
      <CardHeader className="gradient-premium text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="relative z-10">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Globe className="h-7 w-7" />
            Multi-Source Profile Analysis
          </CardTitle>
          <p className="text-white/80 mt-2">
            Combine data from multiple sources for comprehensive profiles
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          {urls.map((urlItem, index) => (
            <div key={urlItem.id} className="group relative">
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Enter URL ${index + 1} (LinkedIn, IMDB, GitHub, etc.)`}
                    value={urlItem.url}
                    onChange={(e) => updateUrl(urlItem.id, e.target.value)}
                    className="pr-24 h-12"
                    disabled={isProcessing}
                  />
                  
                  {/* Status indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {urlItem.status === 'processing' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {urlItem.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {urlItem.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    {urlItem.url && isValidUrl(urlItem.url) && urlItem.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getSourceType(urlItem.url)}
                        </Badge>
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                {urls.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeUrl(urlItem.id)}
                    disabled={isProcessing}
                    className="p-2 h-12 w-12"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Progress bar for individual URL */}
              {urlItem.status === 'processing' && (
                <div className="mt-2">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary progress-flow" />
                  </div>
                </div>
              )}

              {/* Success details */}
              {urlItem.status === 'completed' && urlItem.confidence && (
                <div className="mt-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-success font-medium">
                      ✓ Extracted from {urlItem.source}
                    </span>
                    <Badge className="bg-success/20 text-success border-success/30">
                      {Math.round(urlItem.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              )}

              {/* Error details */}
              {urlItem.status === 'error' && (
                <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <span className="text-destructive text-sm font-medium">
                    ✗ Failed to process this URL
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add URL Button */}
        <div className="flex justify-center">
          <Button
            onClick={addUrl}
            variant="outline"
            disabled={isProcessing || urls.length >= 5}
            className="border-dashed border-2 hover:border-primary/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Source
            {urls.length >= 5 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Max 5
              </Badge>
            )}
          </Button>
        </div>

        {/* Overall Progress */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Processing URLs...</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Process Button */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={processUrls}
            disabled={validUrlCount === 0 || isProcessing}
            className="w-full h-14 text-lg font-bold gradient-premium hover:gradient-shift"
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing {validUrlCount} URL{validUrlCount !== 1 ? 's' : ''}...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5" />
                Process {validUrlCount} URL{validUrlCount !== 1 ? 's' : ''} with AI
              </div>
            )}
          </Button>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {validUrlCount} Valid URLs
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Multi-source analysis
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              Data conflict resolution
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};