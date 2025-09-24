import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Play, User, Building2, Star } from 'lucide-react';

interface ExampleUrlsProps {
  onUrlSelect: (url: string) => void;
}

const exampleUrls = [
  {
    url: 'https://www.imdb.com/name/nm0000982/',
    label: 'Jack Nicholson',
    subtitle: 'Academy Award Winner',
    category: 'Celebrity',
    icon: Star,
    color: 'bg-amber-500/10 text-amber-600 border-amber-200'
  },
  {
    url: 'https://www.linkedin.com/in/satyanadella/',
    label: 'Satya Nadella',
    subtitle: 'CEO of Microsoft',
    category: 'Executive',
    icon: Building2,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200'
  },
  {
    url: 'https://www.imdb.com/name/nm0000138/',
    label: 'Leonardo DiCaprio',
    subtitle: 'Environmental Activist',
    category: 'Actor',
    icon: User,
    color: 'bg-green-500/10 text-green-600 border-green-200'
  }
];

export const ExampleUrls: React.FC<ExampleUrlsProps> = ({ onUrlSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-muted-foreground mb-2">Try these examples:</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {exampleUrls.map((example, index) => {
          const IconComponent = example.icon;
          
          return (
            <button
              key={index}
              onClick={() => onUrlSelect(example.url)}
              className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-300 hover:shadow-md hover:scale-[1.02] text-left"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${example.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {example.label}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    {example.subtitle}
                  </p>
                  
                  <Badge variant="secondary" className="text-xs">
                    {example.category}
                  </Badge>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Click any example to auto-fill the URL field above
        </p>
      </div>
    </div>
  );
};