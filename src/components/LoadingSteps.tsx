import React from 'react';
import { Check, Loader2, Globe, Search, Brain, Database } from 'lucide-react';

interface LoadingStepsProps {
  currentStep: number;
  estimatedTime?: number;
  processingMode?: 'scrapingbee' | 'backend';
}

const getSteps = (processingMode: 'scrapingbee' | 'backend' = 'scrapingbee') => {
  if (processingMode === 'backend') {
    return [
      {
        id: 1,
        icon: Database,
        title: 'Connecting to Backend',
        description: 'Initializing Ujjual\'s AI system'
      },
      {
        id: 2,
        icon: Brain,
        title: 'AI Processing',
        description: 'Gemini AI + Brave Search + IMDB scraping'
      },
      {
        id: 3,
        icon: Check,
        title: 'Profile Generation',
        description: 'Creating comprehensive profile'
      }
    ];
  } else {
    return [
      {
        id: 1,
        icon: Globe,
        title: 'Scraping URL',
        description: 'Fetching webpage content with ScrapingBee'
      },
      {
        id: 2,
        icon: Search,
        title: 'Analyzing Content',
        description: 'Processing HTML structure'
      },
      {
        id: 3,
        icon: Brain,
        title: 'Extracting Data',
        description: 'AI-powered profile analysis'
      }
    ];
  }
};

export const LoadingSteps: React.FC<LoadingStepsProps> = ({ currentStep, estimatedTime, processingMode = 'scrapingbee' }) => {
  const steps = getSteps(processingMode);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;
          
          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500
                ${isCompleted 
                  ? 'bg-success border-success text-success-foreground' 
                  : isCurrent 
                    ? 'bg-primary border-primary text-primary-foreground animate-pulse' 
                    : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                }
              `}>
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1">
                <div className={`font-semibold transition-colors duration-300 ${
                  isCompleted 
                    ? 'text-success' 
                    : isCurrent 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {step.description}
                </div>
              </div>
              
              {isCurrent && estimatedTime && (
                <div className="text-xs text-muted-foreground">
                  ~{estimatedTime}s
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};