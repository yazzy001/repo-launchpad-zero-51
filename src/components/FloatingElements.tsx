import React from 'react';
import { Brain, Sparkles, Zap, Target, Database, Cpu, Atom, Layers, GitBranch } from 'lucide-react';

export const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced floating particles with staggered animations */}
      <div className="particle-float absolute top-16 left-8 text-primary/25" style={{ animationDelay: '0s' }}>
        <Brain className="w-10 h-10 float-slow" />
      </div>
      <div className="particle-float absolute top-24 right-16 text-primary/20" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-7 h-7 float-animation" />
      </div>
      <div className="particle-float absolute top-48 left-1/4 text-primary/30" style={{ animationDelay: '4s' }}>
        <Zap className="w-6 h-6 bounce-gentle" />
      </div>
      <div className="particle-float absolute top-32 right-1/3 text-primary/25" style={{ animationDelay: '6s' }}>
        <Target className="w-8 h-8 spin-slow" />
      </div>
      <div className="particle-float absolute top-64 left-1/2 text-primary/20" style={{ animationDelay: '8s' }}>
        <Database className="w-7 h-7 float-slow" />
      </div>
      <div className="particle-float absolute top-80 right-12 text-primary/35" style={{ animationDelay: '10s' }}>
        <Cpu className="w-6 h-6 pulse-primary" />
      </div>
      <div className="particle-float absolute top-96 left-16 text-accent/40" style={{ animationDelay: '12s' }}>
        <Atom className="w-8 h-8 float-animation" />
      </div>
      <div className="particle-float absolute top-40 left-3/4 text-primary/15" style={{ animationDelay: '14s' }}>
        <Layers className="w-6 h-6 bounce-gentle" />
      </div>
      <div className="particle-float absolute top-72 right-1/4 text-secondary/30" style={{ animationDelay: '16s' }}>
        <GitBranch className="w-7 h-7 float-slow" />
      </div>

      {/* Enhanced gradient overlays for depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-60"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/10 via-primary/5 to-transparent opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-secondary/15 via-secondary/8 to-transparent opacity-30 blur-2xl"></div>
      
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};