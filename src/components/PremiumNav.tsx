import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Globe,
  Users,
  BarChart3,
  Download,
  Settings,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';

interface PremiumNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const PremiumNav: React.FC<PremiumNavProps> = ({ activeView, onViewChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const navigationItems = [
    {
      id: 'single',
      label: 'Single URL Analysis',
      icon: Brain,
      description: 'AI-powered profile extraction',
      premium: false
    },
    {
      id: 'multi',
      label: 'Multi-Source Analysis',
      icon: Globe,
      description: 'Combine multiple data sources',
      premium: true
    },
    {
      id: 'batch',
      label: 'Batch Processing',
      icon: Users,
      description: 'Process hundreds of profiles',
      premium: true
    },
    {
      id: 'analytics',
      label: 'Analytics Dashboard',
      icon: BarChart3,
      description: 'Enterprise insights & metrics',
      premium: true
    },
    {
      id: 'export',
      label: 'Export & Integration',
      icon: Download,
      description: 'Professional export formats',
      premium: true
    }
  ];

  return (
    <div className="relative">
      {/* Premium Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="absolute inset-0 gradient-shift rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 scale-150"></div>
            <div className="relative gradient-premium p-4 rounded-full shadow-xl-premium">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold gradient-premium bg-clip-text text-transparent">
          Enterprise Profile Builder
        </h2>
        <p className="text-muted-foreground mt-2">
          Complete AI-powered profile analysis platform
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="grid gap-3">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            variant={activeView === item.id ? "default" : "ghost"}
            className={`w-full h-auto p-4 justify-start text-left transition-all duration-300 ${
              activeView === item.id 
                ? 'gradient-premium text-white shadow-glow hover:gradient-shift' 
                : 'hover:bg-accent/50 hover-lift border border-transparent hover:border-accent'
            }`}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`p-2 rounded-lg ${
                activeView === item.id 
                  ? 'bg-white/20' 
                  : 'bg-accent/20'
              }`}>
                <item.icon className={`h-5 w-5 ${
                  activeView === item.id ? 'text-white' : 'text-primary'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-sm ${
                    activeView === item.id ? 'text-white' : 'text-foreground'
                  }`}>
                    {item.label}
                  </h3>
                  {item.premium && (
                    <Badge 
                      className={`text-xs ${
                        activeView === item.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-gradient-to-r from-primary to-primary-hover text-white'
                      }`}
                    >
                      PRO
                    </Badge>
                  )}
                </div>
                <p className={`text-xs ${
                  activeView === item.id 
                    ? 'text-white/80' 
                    : 'text-muted-foreground'
                }`}>
                  {item.description}
                </p>
              </div>
              
              {activeView === item.id && (
                <div className="flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Business Value Highlights */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Enterprise Benefits
        </h4>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
            <span>Save 2+ hours per candidate research</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>95% accuracy in profile extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
            <span>Process 100+ profiles in minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
            <span>Enterprise-grade data security</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings & API Keys
        </Button>
      </div>
    </div>
  );
};