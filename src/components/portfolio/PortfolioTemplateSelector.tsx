import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Newspaper,
  ArrowRight,
  CheckCircle,
  Download,
  Eye
} from 'lucide-react';
import { CastingSheetTemplate } from './CastingSheetTemplate';
import { AgencyPortfolioTemplate } from './AgencyPortfolioTemplate';
import { PressKitTemplate } from './PressKitTemplate';

interface ProfileData {
  name?: string;
  description?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  image?: string;
  skills?: string[];
  projects?: Array<{ name: string; role?: string; year?: string; rating?: string }>;
  experience?: Array<{ company: string; position: string; duration?: string }>;
  knownFor?: Array<{ title: string; year?: string; role?: string; rating?: string }>;
  credits?: Array<{ title: string; year?: string; role?: string; type?: string; department?: string }>;
  mediaContent?: {
    photos: Array<{ url: string; alt: string; type: string }>;
    videos: Array<{ url: string; title: string; type: string; thumbnail?: string }>;
    trailers: Array<{ url: string; title: string; type: string; thumbnail?: string }>;
  };
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
  dataQuality?: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
  warnings?: string[];
  errors?: string[];
}

interface PortfolioTemplateSelectorProps {
  profileData: ProfileData;
  onTryAnother: () => void;
}

const templates = [
  {
    id: 'casting-sheet',
    name: 'Casting Sheet',
    description: 'Industry-standard 1-page format for casting directors',
    icon: FileText,
    features: [
      'Headshot prominence',
      'Vital statistics',
      'Recent credits (3 years)',
      'Contact information',
      'Union status',
      'Special skills'
    ],
    audience: 'Casting Directors',
    format: 'Print-ready PDF',
    useCase: 'Auditions & Casting Calls'
  },
  {
    id: 'agency-portfolio',
    name: 'Agency Portfolio',
    description: 'Complete career showcase with interactive media gallery',
    icon: Users,
    features: [
      'Professional photo gallery',
      'Complete filmography',
      'Career timeline',
      'Video reels',
      'Awards showcase',
      'Interactive navigation'
    ],
    audience: 'Talent Agents & Managers',
    format: 'Interactive Web Portfolio',
    useCase: 'Representation & Booking'
  },
  {
    id: 'press-kit',
    name: 'Press Kit',
    description: 'Media-ready format for journalists and publicity',
    icon: Newspaper,
    features: [
      'High-resolution images',
      'Multiple bio lengths',
      'Press quotes',
      'Career highlights',
      'Media contact info',
      'Copy-ready content'
    ],
    audience: 'Journalists & Media',
    format: 'Media Package',
    useCase: 'Publicity & Interviews'
  }
];

export const PortfolioTemplateSelector: React.FC<PortfolioTemplateSelectorProps> = ({ 
  profileData, 
  onTryAnother 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log(`Exporting ${selectedTemplate} template...`);
  };

  const handlePreview = (templateId: string) => {
    setSelectedTemplate(templateId);
    setPreviewMode(true);
  };

  const handleBackToSelector = () => {
    setPreviewMode(false);
    setSelectedTemplate(null);
  };

  // Render selected template
  if (previewMode && selectedTemplate) {
    const templateProps = {
      profileData,
      onExport: handleExport
    };

    switch (selectedTemplate) {
      case 'casting-sheet':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button onClick={handleBackToSelector} variant="outline">
                ← Back to Templates
              </Button>
              <Button onClick={onTryAnother} variant="outline">
                Try Another Profile
              </Button>
            </div>
            <CastingSheetTemplate {...templateProps} />
          </div>
        );
      case 'agency-portfolio':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button onClick={handleBackToSelector} variant="outline">
                ← Back to Templates
              </Button>
              <Button onClick={onTryAnother} variant="outline">
                Try Another Profile
              </Button>
            </div>
            <AgencyPortfolioTemplate {...templateProps} />
          </div>
        );
      case 'press-kit':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button onClick={handleBackToSelector} variant="outline">
                ← Back to Templates
              </Button>
              <Button onClick={onTryAnother} variant="outline">
                Try Another Profile
              </Button>
            </div>
            <PressKitTemplate {...templateProps} />
          </div>
        );
      default:
        return null;
    }
  }

  // Template selector view
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Generated Successfully!</h1>
            <p className="text-muted-foreground">Choose your professional portfolio format</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Data confidence: {Math.round(profileData.confidence * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Generated: {new Date(profileData.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Template Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card 
              key={template.id} 
              className="border-0 shadow-xl-premium hover-lift cursor-pointer group"
              onClick={() => handlePreview(template.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Audience & Format */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">AUDIENCE</span>
                    <Badge variant="outline" className="text-xs">
                      {template.audience}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">FORMAT</span>
                    <Badge variant="secondary" className="text-xs">
                      {template.format}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">USE CASE</span>
                    <span className="text-xs font-medium">{template.useCase}</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full gradient-premium group-hover:gradient-shift"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template.id);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Actions */}
      <div className="flex justify-center gap-4 pt-8 border-t">
        <Button onClick={onTryAnother} variant="outline" size="lg">
          Try Another Profile
        </Button>
      </div>

      {/* Features Comparison */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle className="text-center">Template Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  <th className="text-center p-3">Casting Sheet</th>
                  <th className="text-center p-3">Agency Portfolio</th>
                  <th className="text-center p-3">Press Kit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Print Ready</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="p-3 text-center">–</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Interactive Gallery</td>
                  <td className="p-3 text-center">–</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="p-3 text-center">Limited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Video Integration</td>
                  <td className="p-3 text-center">–</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="p-3 text-center">Links Only</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Copy-Ready Text</td>
                  <td className="p-3 text-center">–</td>
                  <td className="p-3 text-center">–</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Contact Information</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="p-3 text-center">Basic</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Mobile Optimized</td>
                  <td className="p-3 text-center">–</td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};