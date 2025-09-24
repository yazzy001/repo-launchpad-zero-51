import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Film, 
  Award, 
  Star,
  Calendar,
  MapPin,
  User,
  Download,
  ExternalLink,
  Play,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';

interface AgencyPortfolioProps {
  profileData: any;
  onExport: () => void;
}

export const AgencyPortfolioTemplate: React.FC<AgencyPortfolioProps> = ({ 
  profileData, 
  onExport 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  
  const photos = profileData.mediaContent?.photos || [];
  const videos = profileData.mediaContent?.videos || [];
  const trailers = profileData.mediaContent?.trailers || [];

  const openPhotoModal = (photoUrl: string, index: number) => {
    setSelectedPhoto(photoUrl);
    setPhotoIndex(index);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (photoIndex - 1 + photos.length) % photos.length
      : (photoIndex + 1) % photos.length;
    setPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]?.url);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      {/* Header with Profile Image and Basic Info */}
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <div className="w-48 h-48 mx-auto rounded-full overflow-hidden gradient-border-premium">
            <img 
              src={profileData.image || 'https://via.placeholder.com/200'}
              alt={profileData.name || 'Profile'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-full shadow-xl-premium">
            <Star className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4 gradient-premium bg-clip-text text-transparent">
          {profileData.name || 'Professional Actor'}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {profileData.jobTitle && (
            <Badge variant="outline" className="text-lg py-2 px-4">
              <User className="w-4 h-4 mr-2" />
              {profileData.jobTitle}
            </Badge>
          )}
          {profileData.location && (
            <Badge variant="outline" className="text-lg py-2 px-4">
              <MapPin className="w-4 h-4 mr-2" />
              {profileData.location}
            </Badge>
          )}
        </div>
        
        {profileData.description && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {profileData.description}
          </p>
        )}
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="filmography" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 shadow-xl-premium">
            <TabsTrigger value="filmography" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Filmography
            </TabsTrigger>
            <TabsTrigger value="awards" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Awards
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Media
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filmography */}
        <TabsContent value="filmography" className="space-y-6">
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                Featured Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileData.knownFor && profileData.knownFor.length > 0 ? (
                  <div className="grid gap-6">
                    {profileData.knownFor.map((work, index) => (
                      <div key={index} className="flex items-start gap-6 p-6 bg-muted/20 rounded-xl hover-lift">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-28 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                            <Film className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{work.title}</h3>
                              <p className="text-muted-foreground">{work.role}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {work.year && (
                                <Badge variant="secondary" className="mb-1">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {work.year}
                                </Badge>
                              )}
                              {work.rating && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  {work.rating}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No filmography available</p>
                  </div>
                )}
                
                {/* Extended Filmography */}
                {profileData.filmography && profileData.filmography.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border/50">
                    <h3 className="text-xl font-semibold mb-4">Complete Filmography</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profileData.filmography.slice(0, 12).map((film, index) => (
                        <div key={index} className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                          <h4 className="font-medium">{film.title}</h4>
                          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                            <span>{film.role}</span>
                            <span>{film.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Awards & Recognition */}
        <TabsContent value="awards" className="space-y-6">
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Awards & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileData.awards && profileData.awards.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {profileData.awards.map((award, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{award.name}</h4>
                        {award.category && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {award.category}
                          </p>
                        )}
                        {award.year && (
                          <Badge variant="outline" className="mt-2">
                            {award.year}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No awards listed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Media */}
        <TabsContent value="media" className="space-y-6">
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Video Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Trailers */}
                {trailers.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">Demo Reels & Trailers</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {trailers.map((trailer, index) => (
                        <div key={index} className="group relative bg-muted/20 rounded-lg overflow-hidden hover-lift">
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Button 
                              size="lg"
                              className="gradient-premium"
                              onClick={() => window.open(trailer.url, '_blank')}
                            >
                              <Play className="w-6 h-6 mr-2" />
                              Play Reel
                            </Button>
                          </div>
                          <div className="p-4">
                            <h5 className="font-medium">{trailer.title}</h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Videos */}
                {videos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">Additional Videos</h4>
                    <div className="space-y-3">
                      {videos.slice(0, 5).map((video, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                          <Play className="w-5 h-5 text-primary" />
                          <span className="flex-1 font-medium">{video.title}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(video.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trailers.length === 0 && videos.length === 0 && (
                  <div className="text-center py-12">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No video content available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/10"
                  onClick={() => navigatePhoto('prev')}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/10"
                  onClick={() => navigatePhoto('next')}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
            
            <img
              src={selectedPhoto}
              alt="Portfolio"
              className="w-full h-full object-contain rounded-lg"
            />
            
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {photoIndex + 1} of {photos.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className="flex justify-center gap-4 pt-8">
        <Button onClick={onExport} className="gradient-premium" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Export Portfolio
        </Button>
      </div>
    </div>
  );
};
