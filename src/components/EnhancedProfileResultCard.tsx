import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Award,
  Building,
  ExternalLink,
  Download,
  RefreshCw,
  CheckCircle,
  Sparkles,
  Star,
  Film,
  Users,
  Info,
  Database,
  Globe,
  Edit3,
  Save,
  X,
  Trash2,
  Plus,
  Image,
  Play,
  Camera,
  Video,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaContent {
  photos: Array<{ url: string; alt: string; type: string }>;
  videos: Array<{ url: string; title: string; type: string; thumbnail?: string }>;
  trailers: Array<{ url: string; title: string; type: string; thumbnail?: string }>;
}

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
  mediaContent?: MediaContent;
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

interface EnhancedProfileResultCardProps {
  profileData: ProfileData;
  onTryAnother: () => void;
  onExport: () => void;
  processingMode?: 'scrapingbee' | 'backend';
  onProfileUpdate?: (updatedProfile: ProfileData) => void;
}

import { PortfolioTemplateSelector } from './portfolio/PortfolioTemplateSelector';

export const EnhancedProfileResultCard: React.FC<EnhancedProfileResultCardProps> = ({ 
  profileData, 
  onTryAnother, 
  onExport, 
  processingMode = 'scrapingbee',
  onProfileUpdate
}) => {
  // Use the new template selector instead of the old card design
  return (
    <PortfolioTemplateSelector 
      profileData={profileData}
      onTryAnother={onTryAnother}
    />
  );
};
