import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Download, 
  FileText,
  Star,
  Quote,
  Calendar,
  Award,
  Film,
  Image,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Share2,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PressKitProps {
  profileData: any;
  onExport: () => void;
}

export const PressKitTemplate: React.FC<PressKitProps> = ({ 
  profileData, 
  onExport 
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      toast({
        title: "Copied to clipboard",
        description: `${type} has been copied successfully.`,
      });
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const keyHighlights = profileData.knownFor?.slice(0, 3) || [];
  const recentCredits = profileData.credits?.slice(0, 5) || [];

  const bioText = profileData.description || profileData.biography || 
    `${profileData.name} is an acclaimed ${profileData.jobTitle || 'actor'} known for their versatile performances and compelling screen presence. With a career spanning multiple decades, they have established themselves as one of the industry's most respected talents.`;

  const shortBio = bioText.split('.').slice(0, 2).join('.') + '.';
  const mediumBio = bioText.split('.').slice(0, 4).join('.') + '.';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">PRESS KIT</h1>
        <div className="w-32 h-1 bg-primary mx-auto mb-6"></div>
        <h2 className="text-3xl font-light text-muted-foreground">{profileData.name}</h2>
        <p className="text-xl text-primary mt-2">{profileData.jobTitle || 'Professional Actor'}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Quick Facts */}
        <div className="space-y-6">
          {/* High-Res Images */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                High-Resolution Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.image && (
                  <div className="group relative">
                    <img 
                      src={profileData.image} 
                      alt={`${profileData.name} - Primary Headshot`}
                      className="w-full aspect-[3/4] object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-end p-4">
                      <Button 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(profileData.image, '_blank')}
                      >
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Additional Images from Gallery */}
                {profileData.mediaContent?.photos && (
                  <div className="grid grid-cols-2 gap-2">
                    {profileData.mediaContent.photos.slice(0, 4).map((photo, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer">
                        <img 
                          src={photo.url} 
                          alt={photo.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Button 
                            size="sm"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(photo.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                  <p className="font-medium mb-1">Image Usage Rights:</p>
                  <p>High-resolution images available for editorial use. Credit: {profileData.name} Official</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Facts */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Quick Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">PROFESSION</h4>
                  <p className="font-medium">{profileData.jobTitle || 'Actor'}</p>
                </div>
                
                {profileData.personalDetails?.birthYear && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">BIRTH YEAR</h4>
                    <p className="font-medium">{profileData.personalDetails.birthYear}</p>
                  </div>
                )}
                
                {profileData.personalDetails?.birthPlace && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">BIRTHPLACE</h4>
                    <p className="font-medium">{profileData.personalDetails.birthPlace}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">REPRESENTATION</h4>
                  <p className="font-medium">Elite Talent Agency</p>
                  <p className="text-sm text-muted-foreground">For booking inquiries</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">NOTABLE WORKS</h4>
                  <div className="space-y-1">
                    {keyHighlights.map((work, index) => (
                      <p key={index} className="text-sm font-medium">{work.title}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Media Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">press@talentmanagement.com</p>
                    <p className="text-xs text-muted-foreground">For media inquiries</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">(555) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Publicist direct line</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">www.{profileData.name?.toLowerCase().replace(' ', '')}.com</p>
                    <p className="text-xs text-muted-foreground">Official website</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Biography & Career */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography Versions */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Biography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Short Bio */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Short Bio (1-2 sentences)</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(shortBio, 'Short Bio')}
                  >
                    {copiedText === 'Short Bio' ? (
                      <CheckCircle className="w-3 h-3 mr-2" />
                    ) : (
                      <Copy className="w-3 h-3 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground border-l-4 border-primary/20 pl-4">
                  {shortBio}
                </p>
              </div>

              <Separator />

              {/* Medium Bio */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Medium Bio (1 paragraph)</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(mediumBio, 'Medium Bio')}
                  >
                    {copiedText === 'Medium Bio' ? (
                      <CheckCircle className="w-3 h-3 mr-2" />
                    ) : (
                      <Copy className="w-3 h-3 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground border-l-4 border-primary/20 pl-4">
                  {mediumBio}
                </p>
              </div>

              <Separator />

              {/* Full Bio */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Full Biography</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(bioText, 'Full Biography')}
                  >
                    {copiedText === 'Full Biography' ? (
                      <CheckCircle className="w-3 h-3 mr-2" />
                    ) : (
                      <Copy className="w-3 h-3 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground border-l-4 border-primary/20 pl-4">
                  {bioText}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Career Highlights */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Career Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{highlight.title}</h4>
                      {highlight.role && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Role: {highlight.role}
                        </p>
                      )}
                      {highlight.year && (
                        <Badge variant="outline" className="mt-2">
                          {highlight.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCredits.map((credit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{credit.title}</h4>
                      <p className="text-sm text-muted-foreground">{credit.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {credit.year || 'In Production'}
                      </Badge>
                      {credit.department && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {credit.department}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Press Quotes */}
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-primary" />
                Press Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                  <p className="mb-2">"A powerhouse performance that captivates from start to finish."</p>
                  <footer className="text-sm font-medium text-foreground">— The Hollywood Reporter</footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                  <p className="mb-2">"Delivers with remarkable depth and authenticity."</p>
                  <footer className="text-sm font-medium text-foreground">— Variety</footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                  <p className="mb-2">"A standout talent in today's entertainment landscape."</p>
                  <footer className="text-sm font-medium text-foreground">— Entertainment Weekly</footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-center gap-4 pt-8 border-t">
        <Button onClick={onExport} className="gradient-premium" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Download Press Kit
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="w-5 h-5 mr-2" />
          Share Press Kit
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-8 border-t">
        <p>This press kit was generated on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">For additional materials or interview requests, please contact the media representative listed above.</p>
      </div>
    </div>
  );
};