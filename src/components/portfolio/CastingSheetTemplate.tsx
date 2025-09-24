import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MapPin, 
  Calendar, 
  Ruler,
  Phone,
  Mail,
  Film,
  Award,
  Download,
  Star
} from 'lucide-react';

interface CastingSheetProps {
  profileData: any;
  onExport: () => void;
}

export const CastingSheetTemplate: React.FC<CastingSheetProps> = ({ 
  profileData, 
  onExport 
}) => {
  const recentCredits = profileData.credits?.slice(0, 8) || [];
  const currentYear = new Date().getFullYear();
  const threeYearsAgo = currentYear - 3;
  
  const filteredCredits = recentCredits.filter(credit => {
    const year = parseInt(credit.year || '0');
    return year >= threeYearsAgo;
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-card print:p-4 print:max-w-full">
      {/* Header with Logo Space */}
      <div className="text-center mb-8 print:mb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">CASTING SHEET</h1>
        <div className="w-24 h-1 bg-primary mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-4">
        {/* Left Column - Headshot */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-xl-premium">
            <CardContent className="p-0">
              {profileData.image ? (
                <div className="relative group">
                  <img 
                    src={profileData.image} 
                    alt={`${profileData.name} Headshot`}
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                </div>
              ) : (
                <div className="w-full aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-6 border-0 shadow-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-lg">CONTACT</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="truncate">agent@talentanency.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{profileData.location || 'Los Angeles, CA'}</span>
                </div>
              </div>
              
              {/* Union Status */}
              <div className="mt-4 pt-4 border-t">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  SAG-AFTRA
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name and Title */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-foreground mb-2 print:text-3xl">
              {profileData.name?.toUpperCase()}
            </h1>
            <p className="text-xl text-primary font-semibold">
              {profileData.jobTitle || 'Professional Actor'}
            </p>
          </div>

          {/* Vital Statistics */}
          <Card className="border-0 shadow-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-lg">VITAL STATISTICS</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-sm text-muted-foreground">Age Range</span>
                      <p className="font-medium">25-35</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-sm text-muted-foreground">Height</span>
                      <p className="font-medium">{profileData.personalDetails?.height || "5'8\""}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-sm text-muted-foreground">Hair</span>
                      <p className="font-medium">Brown</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-sm text-muted-foreground">Eyes</span>
                      <p className="font-medium">Blue</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Credits */}
          <Card className="border-0 shadow-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                RECENT CREDITS (LAST 3 YEARS)
              </h3>
              <div className="space-y-3">
                {filteredCredits.length > 0 ? (
                  filteredCredits.map((credit, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{credit.title}</h4>
                        <p className="text-xs text-muted-foreground">{credit.role}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {credit.year}
                        </Badge>
                        {credit.department && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {credit.department}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent credits available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Special Skills */}
          <Card className="border-0 shadow-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                SPECIAL SKILLS
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Stage Combat', 'Horseback Riding', 'Piano', 'Spanish (Fluent)', 'Rock Climbing', 'Yoga Instructor', 'Motorcycle License', 'Archery'].map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training/Awards */}
          {profileData.knownFor && profileData.knownFor.length > 0 && (
            <Card className="border-0 shadow-premium">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  TRAINING & AWARDS
                </h3>
                <div className="space-y-2">
                  {profileData.knownFor.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.year && (
                        <Badge variant="outline" className="text-xs">
                          {item.year}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center print:hidden">
        <Button onClick={onExport} className="gradient-premium">
          <Download className="w-4 h-4 mr-2" />
          Download as PDF
        </Button>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
        Generated by Auto Profile Creator • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};