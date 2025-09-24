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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
                {profileData.name}
              </h1>
              <p className="text-2xl text-primary font-semibold mb-2">
                {profileData.jobTitle || 'Professional Actor'}
              </p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location || 'Los Angeles, CA'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Available</span>
                </div>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed text-muted-foreground">
              {profileData.description || profileData.biography || 'Award-winning talent with extensive experience across film, television, and theater.'}
            </p>

            <div className="flex gap-3">
              <Button className="gradient-premium">
                <Download className="w-4 h-4 mr-2" />
                Download Portfolio
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Reel
              </Button>
            </div>
          </div>

          <div className="relative">
            {profileData.image && (
              <div className="relative group">
                <img 
                  src={profileData.image} 
                  alt={profileData.name}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-xl-premium aspect-[3/4] object-cover hover-lift"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Tabs */}
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Gallery
          </TabsTrigger>
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

        {/* Photo Gallery */}
        <TabsContent value="gallery" className="space-y-6">
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Professional Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div 
                      key={index}
                      className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer hover-lift"
                      onClick={() => openPhotoModal(photo.url, index)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.alt}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No photos available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complete Filmography */}
        <TabsContent value="filmography" className="space-y-6">
          <Card className="border-0 shadow-xl-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                Complete Filmography ({profileData.credits?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {profileData.credits && profileData.credits.length > 0 ? (
                  profileData.credits.map((credit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{credit.title}</h4>
                        <p className="text-muted-foreground">{credit.role}</p>
                        {credit.department && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {credit.department}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {credit.year || 'TBA'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No filmography available</p>
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
              {profileData.knownFor && profileData.knownFor.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {profileData.knownFor.map((award, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{award.title}</h4>
                        {award.role && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {award.role}
                          </p>
                        )}
                        {award.year && (
                          <Badge variant="outline" className="mt-2">
                            {award.year}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
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
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img 
              src={selectedPhoto} 
              alt="Portfolio photo"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            
            {/* Controls */}
            <Button
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            {photos.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={() => navigatePhoto('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={() => navigatePhoto('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Photo counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {photoIndex + 1} of {photos.length}
            </div>
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
