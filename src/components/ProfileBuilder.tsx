import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Globe, AlertCircle, Brain, Sparkles, Zap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { LoadingSteps } from '@/components/LoadingSteps';
import { ExampleUrls } from '@/components/ExampleUrls';
import { ProfileResultCard } from '@/components/ProfileResultCard';
import { FloatingElements } from '@/components/FloatingElements';
import { WebScrapingService, LLMService } from '@/utils/LLMService';

interface ProfileData {
  name?: string;
  description?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  url?: string;
  image?: string;
  skills?: string[];
  projects?: Array<{ name: string; role?: string; year?: string }>;
  experience?: Array<{ company: string; position: string; duration?: string }>;
  generatedAt?: string;
  sourceUrl?: string;
  confidence?: number;
}

const ProfileBuilder = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const { toast } = useToast();

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  };

  // Loading progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeoutStep2: NodeJS.Timeout;
    let timeoutStep3: NodeJS.Timeout;
    
    if (isLoading) {
      setLoadingStep(1);
      setEstimatedTime(15);
      
      // Simulate step progression
      timeoutStep2 = setTimeout(() => setLoadingStep(2), 2000);
      timeoutStep3 = setTimeout(() => setLoadingStep(3), 5000);
      
      // Countdown timer
      interval = setInterval(() => {
        setEstimatedTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutStep2);
      clearTimeout(timeoutStep3);
    };
  }, [isLoading]);

  const handleGenerateProfile = async () => {
    if (!url || !isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const geminiKey = LLMService.getGeminiApiKey();
      const scrapingBeeKey = WebScrapingService.getScrapingBeeApiKey();
      
      // Check if we have at least ScrapingBee API key
      if (!scrapingBeeKey && !geminiKey) {
        toast({
          title: 'Missing API keys',
          description: 'Please set either ScrapingBee or Gemini API key (top-right API Key button).',
          variant: 'destructive',
        });
        throw new Error('No API keys available');
      }

      // Scrape the website content
      setLoadingStep(1);
      const scrapeResult = await WebScrapingService.scrapeUrl(url);
      if (!scrapeResult.success) {
        throw new Error(scrapeResult.error || 'Failed to scrape website');
      }

      // Extract profile data using AI
      setLoadingStep(3);
      const parsed = await LLMService.extractPersonProfile(url, scrapeResult.content!);

      const mapped: ProfileData = {
        name: parsed.name,
        description: parsed.description,
        jobTitle: parsed.jobTitle,
        company: parsed.company,
        location: parsed.location,
        image: parsed.image,
        skills: parsed.skills,
        projects: parsed.projects,
        experience: parsed.experience,
        generatedAt: parsed.generatedAt,
        sourceUrl: parsed.sourceUrl,
        url: parsed.sourceUrl,
        confidence: parsed.confidence,
      };

      setProfileData(mapped);

      toast({
        title: 'Profile Generated',
        description: `Successfully extracted profile data with ${Math.round(mapped.confidence! * 100)}% confidence.`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate profile');
      toast({
        title: 'Error',
        description: err?.message || 'Failed to generate profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setError(null);
  };

  const handleTryAnother = () => {
    setUrl('');
    setProfileData(null);
    setError(null);
  };

  const handleExport = () => {
    if (profileData) {
      const dataStr = JSON.stringify(profileData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-${profileData.name?.replace(/\s+/g, '-').toLowerCase() || 'data'}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Profile Exported',
        description: 'Profile data has been downloaded as JSON file.',
      });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingElements />
      
      {/* Enhanced Hero Section */}
      <div className="container mx-auto px-4 py-24 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Premium animated header */}
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 gradient-shift rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 scale-150"></div>
                {/* Inner glow */}
                <div className="absolute inset-0 gradient-flow rounded-full blur-xl opacity-40"></div>
                {/* Main icon container */}
                <div className="relative gradient-premium p-6 rounded-full shadow-xl-premium hover-glow">
                  <Brain className="w-16 h-16 text-white float-animation drop-shadow-lg" />
                </div>
                {/* Orbiting particles */}
                <div className="absolute top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-primary/60 bounce-gentle" />
                </div>
                <div className="absolute -top-2 left-2">
                  <Zap className="w-5 h-5 text-primary/40 float-slow" />
                </div>
              </div>
            </div>
            
            {/* Enhanced title with gradient text */}
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="gradient-premium bg-clip-text text-transparent">
                AI Profile
              </span>
              <br />
              <span className="text-shimmer">
                Builder
              </span>
            </h1>
            
            {/* Enhanced subtitle */}
            <div className="space-y-6 mb-12">
              <p className="text-2xl lg:text-3xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed">
                Transform any URL into rich, structured profile data with 
                <span className="text-primary font-semibold"> advanced AI analysis</span>
              </p>
              <p className="text-lg text-muted-foreground/90 max-w-3xl mx-auto">
                Extract professional information from LinkedIn, IMDB, company profiles, and more using cutting-edge machine learning technology
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[
                { icon: Brain, text: 'AI-Powered', color: 'text-blue-500' },
                { icon: Zap, text: 'Lightning Fast', color: 'text-yellow-500' },
                { icon: Target, text: 'Highly Accurate', color: 'text-green-500' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover-lift"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Premium Input Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden hover-lift">
              {/* Enhanced card header */}
              <CardHeader className="text-center pb-6 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
                }}></div>
                
                <div className="relative z-10">
                  <CardTitle className="text-3xl font-bold flex items-center justify-center gap-4 mb-3">
                    <div className="relative">
                      <Sparkles className="h-8 w-8 text-primary glow-pulse" />
                      <div className="absolute inset-0 blur-md">
                        <Sparkles className="h-8 w-8 text-primary opacity-50" />
                      </div>
                    </div>
                    Enter Profile URL
                  </CardTitle>
                  <CardDescription className="text-xl text-muted-foreground font-medium">
                    Powered by <span className="text-primary font-semibold">Google Gemini 2.0 Flash</span> - completely free
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 px-10 pb-10">
                <div className="space-y-6">
                  {/* Enhanced URL input */}
                  <div className="relative group">
                    {/* Input glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary-hover/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    
                    <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/example or https://imdb.com/name/example"
                        value={url}
                        onChange={handleUrlChange}
                        className={`h-20 text-lg px-8 pr-16 rounded-2xl border-2 transition-all duration-300 bg-background/80 backdrop-blur-sm font-medium placeholder:text-muted-foreground/60 ${
                          error 
                            ? 'border-destructive bg-destructive/5 shadow-inner-glow' 
                            : 'border-border focus:border-primary bg-background/90 hover:bg-background focus:bg-background shadow-premium'
                        }`}
                        disabled={isLoading}
                      />
                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 transition-colors duration-300">
                        <Globe className={`h-6 w-6 ${url ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      
                      {/* URL validation indicator */}
                      {url && (
                        <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                          <div className={`w-3 h-3 rounded-full ${
                            isValidUrl(url) ? 'bg-success animate-pulse' : 'bg-destructive'
                          }`}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced error display */}
                  {error && (
                    <div className="animate-scale-in p-5 rounded-xl bg-destructive/10 border border-destructive/20 shadow-inner-glow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-destructive/20">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-semibold text-destructive">Input Error</p>
                          <p className="text-sm text-destructive/80">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Premium generate button */}
                  <Button 
                    onClick={handleGenerateProfile}
                    disabled={!url || isLoading || !isValidUrl(url)}
                    size="lg"
                    className="w-full h-20 text-xl font-bold rounded-2xl gradient-premium hover:gradient-shift transition-all duration-500 shadow-glow hover:shadow-xl-premium hover:scale-[1.02] transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Loader2 className="h-7 w-7 animate-spin" />
                          <div className="absolute inset-0 blur-sm">
                            <Loader2 className="h-7 w-7 animate-spin opacity-50" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span>Analyzing with AI...</span>
                          <span className="text-sm opacity-80 font-normal">This may take a moment</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Zap className="h-7 w-7" />
                          <div className="absolute inset-0 blur-sm">
                            <Zap className="h-7 w-7 opacity-50" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span>Generate Profile with AI</span>
                          <span className="text-sm opacity-90 font-normal">Powered by Gemini 2.0</span>
                        </div>
                      </div>
                    )}
                  </Button>
                </div>
                
                {/* Enhanced example URLs */}
                {!isLoading && !profileData && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <ExampleUrls onUrlSelect={handleUrlSelect} />
                  </div>
                )}
                
                {/* Enhanced footer */}
                <div className="flex justify-between items-center pt-6 border-t border-border/30">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="relative">
                      <Brain className="h-5 w-5 text-primary" />
                      <div className="absolute inset-0 blur-sm">
                        <Brain className="h-5 w-5 text-primary opacity-30" />
                      </div>
                    </div>
                    <span className="font-medium">Powered by Gemini 2.0 Flash</span>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                    <span className="text-xs">Enterprise-grade AI</span>
                  </div>
                  <ApiKeySettings />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Premium Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 pb-20 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden">
              <CardContent className="p-12">
                <div className="text-center mb-10">
                  <div className="relative inline-block mb-6">
                    {/* Multiple glow layers */}
                    <div className="absolute inset-0 gradient-shift rounded-full blur-2xl opacity-40 scale-150"></div>
                    <div className="absolute inset-0 gradient-flow rounded-full blur-xl opacity-60"></div>
                    
                    <div className="relative gradient-premium p-8 rounded-full shadow-xl-premium">
                      <Brain className="w-12 h-12 text-white animate-bounce-gentle drop-shadow-lg" />
                    </div>
                    
                    {/* Orbiting elements */}
                    <div className="absolute -top-2 -right-2">
                      <div className="w-4 h-4 bg-primary/60 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute -bottom-2 -left-2">
                      <div className="w-3 h-3 bg-accent/80 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-3 gradient-premium bg-clip-text text-transparent">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-lg text-muted-foreground mb-2">
                    Our advanced AI is carefully extracting profile data
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Using state-of-the-art machine learning algorithms
                  </p>
                </div>
                
                <LoadingSteps currentStep={loadingStep} estimatedTime={estimatedTime} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Premium Results Section */}
      {profileData && !isLoading && (
        <div className="container mx-auto px-4 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            <ProfileResultCard 
              profileData={profileData}
              onTryAnother={handleTryAnother}
              onExport={handleExport}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBuilder;