import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
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
  Camera,
  Video,
  Play,
  Image,
  Heart,
  BookOpen,
  Trophy,
  Quote
} from 'lucide-react';

interface ProfileData {
  name?: string;
  description?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  url?: string;
  image?: string;
  skills?: string[];
  projects?: Array<{ name: string; role?: string; year?: string }>;
  experience?: Array<{ company: string; position: string; duration?: string }>;
  // Enhanced IMDB-specific fields
  knownFor?: Array<{ title: string; year?: string; role?: string; rating?: string }>;
  filmography?: Array<{ title: string; year?: string; role?: string; type?: string }>;
  credits?: Array<{ title: string; year?: string; role?: string; type?: string; department?: string }>;
  awards?: Array<{ name: string; year?: string; category?: string }>;
  personalDetails?: {
    birthYear?: string;
    birthPlace?: string;
    height?: string;
    relatives?: Array<{ name: string; relationship: string }>;
  };
  // Enhanced media content for artists
  mediaContent?: {
    photos?: Array<{ url: string; alt: string; type: string }>;
    videos?: Array<{ url: string; title: string; type: string; thumbnail?: string }>;
    trailers?: Array<{ url: string; title: string; type: string; thumbnail?: string }>;
  };
  trivia?: string[];
  biography?: string;
  generatedAt?: string;
  sourceUrl?: string;
  confidence?: number;
}

interface ProfileResultCardProps {
  profileData: ProfileData;
  onTryAnother: () => void;
  onExport: () => void;
}

export const ProfileResultCard: React.FC<ProfileResultCardProps> = ({ 
  profileData, 
  onTryAnother, 
  onExport 
}) => {
  const { toast } = useToast();
  const confidenceScore = Math.round((profileData.confidence || 0) * 100);
  const confidenceColor = confidenceScore >= 80 ? 'text-success' : confidenceScore >= 60 ? 'text-warning' : 'text-destructive';

  return (
    <div className="animate-fade-in-up">
      <Card className="shadow-xl-premium border-0 glass-premium overflow-hidden hover-lift">
        {/* Enhanced Header with premium gradient */}
        <CardHeader className="gradient-shift text-white relative overflow-hidden p-8">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
          
          {/* Floating success indicator */}
          <div className="absolute top-4 right-4">
            <div className="float-animation">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-white/90 drop-shadow-lg" />
                <div className="absolute inset-0 blur-sm">
                  <Sparkles className="w-8 h-8 text-white/50" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  <CheckCircle className="h-8 w-8 text-white drop-shadow-sm" />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl font-bold mb-1">Profile Generated Successfully</CardTitle>
                  <p className="text-white/80 text-sm">AI analysis completed with high accuracy</p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className="bg-white/25 text-white border-white/40 backdrop-blur-sm px-4 py-2 text-lg font-semibold">
                  {confidenceScore}% confidence
                </Badge>
                <p className="text-white/70 text-xs mt-1">Quality Score</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-white/90 font-medium">Data Quality Assessment:</span>
              <div className="flex-1 max-w-48">
                <Progress 
                  value={confidenceScore} 
                  className="h-3 bg-white/20 border border-white/30" 
                />
              </div>
              <span className="text-white/80 text-sm font-medium">
                {confidenceScore >= 80 ? 'Excellent' : confidenceScore >= 60 ? 'Good' : 'Fair'}
              </span>
            </div>
          </div>
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent"></div>
        </CardHeader>

        <CardContent className="p-10">
          <div className="space-y-12">
            {/* Compact Profile Header */}
            {profileData.image && (
              <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 animate-fade-in-up">
                <div className="relative">
                  <img 
                    src={profileData.image} 
                    alt={profileData.name}
                    className="w-24 h-24 rounded-full object-cover shadow-xl-premium border-4 border-white/20"
                  />
                  <div className="absolute -top-1 -right-1 p-1 bg-primary rounded-full">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{profileData.name}</h2>
                  {profileData.jobTitle && (
                    <p className="text-lg font-medium text-primary mb-2">{profileData.jobTitle}</p>
                  )}
                  {profileData.personalDetails?.birthPlace && (
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profileData.personalDetails.birthPlace}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Profile Information */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8 animate-slide-in-left">
                {/* Premium Basic Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 gradient-premium rounded-xl">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">Extracted profile details</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-5">
                    {profileData.name && (
                      <div className="group p-6 rounded-xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent hover:from-accent/30 hover:via-accent/20 hover:to-accent/5 transition-all duration-300 border border-accent/20 hover:border-accent/30 hover-lift">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          Full Name
                        </p>
                        <p className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">{profileData.name}</p>
                      </div>
                    )}
                    
                    {profileData.jobTitle && (
                      <div className="group p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 hover:to-primary/5 transition-all duration-300 border border-primary/20 hover:border-primary/30 hover-lift">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          Profession
                        </p>
                        <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{profileData.jobTitle}</p>
                      </div>
                    )}
                    
                    {profileData.personalDetails?.birthYear && (
                      <div className="group p-6 rounded-xl bg-gradient-to-br from-success/10 via-success/5 to-transparent hover:from-success/20 hover:via-success/10 hover:to-success/5 transition-all duration-300 border border-success/20 hover:border-success/30 hover-lift">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          Born
                        </p>
                        <p className="font-bold text-lg text-foreground group-hover:text-success transition-colors duration-300">{profileData.personalDetails.birthYear}</p>
                      </div>
                    )}
                    
                    {profileData.personalDetails?.height && (
                      <div className="group p-6 rounded-xl bg-gradient-to-br from-warning/10 via-warning/5 to-transparent hover:from-warning/20 hover:via-warning/10 hover:to-warning/5 transition-all duration-300 border border-warning/20 hover:border-warning/30 hover-lift">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-warning"></div>
                          Height
                        </p>
                        <p className="font-bold text-lg text-foreground group-hover:text-warning transition-colors duration-300">{profileData.personalDetails.height}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Skills Section */}
                {profileData.skills && profileData.skills.length > 0 && (
                  <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 gradient-premium rounded-xl">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Skills & Expertise</h3>
                        <p className="text-sm text-muted-foreground">Professional capabilities</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {profileData.skills.map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/15 to-primary/10 text-primary hover:from-primary/25 hover:to-primary/20 border border-primary/20 hover:border-primary/30 transition-all duration-300 cursor-default hover-lift"
                          style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Description and Personal Details */}
              <div className="space-y-8 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                {/* Premium Description Section */}
                {(profileData.description || profileData.biography) && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 gradient-premium rounded-xl">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Biography</h3>
                        <p className="text-sm text-muted-foreground">Professional overview</p>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-accent/20 to-muted/30 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent rounded-2xl"></div>
                      
                      <div className="relative p-8 border border-accent/30 rounded-2xl backdrop-blur-sm">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground leading-relaxed text-base font-medium">
                            {profileData.biography || profileData.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground/70">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <span>Extracted from source</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Family/Relatives */}
                {profileData.personalDetails?.relatives && profileData.personalDetails.relatives.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 gradient-premium rounded-xl">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Family</h3>
                        <p className="text-sm text-muted-foreground">Related individuals</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {profileData.personalDetails.relatives.map((relative, index) => (
                        <div key={index} className="group p-4 rounded-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:from-accent/20 hover:via-accent/10 hover:to-accent/5 transition-all duration-300 border border-accent/20 hover:border-accent/30 hover-lift">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">{relative.name}</span>
                            <Badge variant="outline" className="text-xs">{relative.relationship}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Known For Section */}
            {profileData.knownFor && profileData.knownFor.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 gradient-premium rounded-xl">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Known For</h3>
                    <p className="text-sm text-muted-foreground">Most notable works</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileData.knownFor.map((work, index) => (
                    <div key={index} className="group p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 hover:to-primary/5 transition-all duration-300 border border-primary/20 hover:border-primary/30 hover-lift">
                      <div className="flex items-start justify-between mb-3">
                        <Film className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        {work.rating && (
                          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            ⭐ {work.rating}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 mb-2">{work.title}</h4>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{work.year}</span>
                        {work.role && <span className="font-medium">{work.role}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filmography Section */}
            {profileData.filmography && profileData.filmography.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 gradient-premium rounded-xl">
                    <Film className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Filmography</h3>
                    <p className="text-sm text-muted-foreground">Complete works ({profileData.filmography.length} entries)</p>
                  </div>
                </div>
                
                <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                  {profileData.filmography.map((film, index) => (
                    <div key={index} className="group p-4 rounded-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:from-accent/20 hover:via-accent/10 hover:to-accent/5 transition-all duration-300 border border-accent/20 hover:border-accent/30 hover-lift">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{film.title}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            {film.year && <span>{film.year}</span>}
                            {film.role && <span>as {film.role}</span>}
                          </div>
                        </div>
                        {film.type && (
                          <Badge variant="outline" className="text-xs ml-2">{film.type}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trivia Section */}
            {profileData.trivia && profileData.trivia.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 gradient-premium rounded-xl">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Trivia</h3>
                    <p className="text-sm text-muted-foreground">Interesting facts</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {profileData.trivia.map((fact, index) => (
                    <div key={index} className="group p-6 rounded-xl bg-gradient-to-br from-warning/10 via-warning/5 to-transparent hover:from-warning/20 hover:via-warning/10 hover:to-warning/5 transition-all duration-300 border border-warning/20 hover:border-warning/30 hover-lift">
                      <p className="text-muted-foreground leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Source Information */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 gradient-premium rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Source Information</h3>
                  <p className="text-sm text-muted-foreground">Analysis metadata</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 hover:to-primary/5 transition-all duration-300 border border-primary/20 hover:border-primary/30 hover-lift">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Original URL
                  </p>
                  <a 
                    href={profileData.sourceUrl || profileData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover font-semibold flex items-center gap-3 group-hover:gap-4 transition-all duration-300 hover-glow rounded-lg p-2 -m-2"
                  >
                    <span className="truncate text-sm">{profileData.sourceUrl || profileData.url}</span>
                    <ExternalLink className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                </div>
                
                <div className="group p-6 rounded-xl bg-gradient-to-br from-success/10 via-success/5 to-transparent hover:from-success/20 hover:via-success/10 hover:to-success/5 transition-all duration-300 border border-success/20 hover:border-success/30 hover-lift">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    Generated
                  </p>
                  <p className="font-semibold flex items-center gap-3 text-foreground group-hover:text-success transition-colors duration-300">
                    <Calendar className="h-5 w-5 text-success" />
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Biography Section - Full Text */}
            {profileData.description && (
              <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 gradient-premium rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Complete Biography</h3>
                    <p className="text-sm text-muted-foreground">Full artist story and background</p>
                  </div>
                </div>
                
                <div className="p-8 rounded-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 hover:border-accent/30 transition-all duration-300">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
                      {profileData.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Media Gallery Section */}
            {profileData.mediaContent && (
              <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 gradient-premium rounded-xl">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Media Gallery</h3>
                    <p className="text-sm text-muted-foreground">Photos, videos, and trailers</p>
                  </div>
                </div>

                {/* Enhanced Photos Gallery */}
                {profileData.mediaContent.photos && profileData.mediaContent.photos.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 gradient-premium rounded-lg">
                          <Image className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-lg">Photo Gallery</h4>
                          <p className="text-sm text-muted-foreground">{profileData.mediaContent.photos.length} professional photos</p>
                        </div>
                      </div>
                      <Badge className="gradient-premium text-white">HD Quality</Badge>
                    </div>
                    
                    {/* Hero Photo */}
                    {profileData.mediaContent.photos[0] && (
                      <div className="relative group overflow-hidden rounded-2xl shadow-xl-premium hover-lift">
                        <img 
                          src={profileData.mediaContent.photos[0].url} 
                          alt={profileData.mediaContent.photos[0].alt}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onClick={() => window.open(profileData.mediaContent.photos[0].url, '_blank')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer" />
                        <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-lg font-semibold drop-shadow-lg">{profileData.mediaContent.photos[0].alt}</p>
                          <p className="text-sm text-white/80 drop-shadow-lg">Click to view full size</p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="p-2 bg-black/20 backdrop-blur-sm rounded-full">
                            <ExternalLink className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Photo Grid */}
                    {profileData.mediaContent.photos.length > 1 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {profileData.mediaContent.photos.slice(1, 9).map((photo, index) => (
                          <div key={index + 1} className="relative group overflow-hidden rounded-xl shadow-premium hover-lift">
                            <img 
                              src={photo.url} 
                              alt={photo.alt}
                              className="w-full h-40 object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                              loading="lazy"
                              onClick={() => window.open(photo.url, '_blank')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer" />
                            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-xs font-medium drop-shadow-lg truncate">
                                {photo.alt}
                              </p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="p-1 bg-black/20 backdrop-blur-sm rounded-full">
                                <Camera className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* View More Button */}
                    {profileData.mediaContent.photos.length > 9 && (
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          className="gradient-premium text-white border-0 hover:gradient-shift"
                          onClick={() => {
                            // Open a gallery modal or navigate to full gallery
                            toast({
                              title: "Full Gallery",
                              description: `View all ${profileData.mediaContent.photos.length} photos in full resolution.`,
                            });
                          }}
                        >
                          <Image className="h-4 w-4 mr-2" />
                          View All {profileData.mediaContent.photos.length} Photos
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Video Showcase */}
                {((profileData.mediaContent.videos && profileData.mediaContent.videos.length > 0) || 
                  (profileData.mediaContent.trailers && profileData.mediaContent.trailers.length > 0)) && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 gradient-premium rounded-lg">
                          <Video className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-lg">Video Showcase</h4>
                          <p className="text-sm text-muted-foreground">
                            {(profileData.mediaContent.videos?.length || 0) + (profileData.mediaContent.trailers?.length || 0)} videos available
                          </p>
                        </div>
                      </div>
                      <Badge className="gradient-premium text-white">HD Streaming</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Featured Trailers */}
                      {profileData.mediaContent.trailers?.map((trailer, index) => (
                        <div key={`trailer-${index}`} className="relative group">
                          <div className="relative overflow-hidden rounded-2xl shadow-xl-premium hover-lift transition-all duration-300">
                            {trailer.thumbnail ? (
                              <div className="relative">
                                <img 
                                  src={trailer.thumbnail} 
                                  alt={trailer.title}
                                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                                    <Play className="h-8 w-8 text-white fill-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <div className="p-6 bg-primary/20 backdrop-blur-sm rounded-full group-hover:bg-primary/30 transition-all duration-300">
                                  <Play className="h-12 w-12 text-primary" />
                                </div>
                              </div>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-red-600 text-white text-xs">TRAILER</Badge>
                                <Badge variant="secondary" className="text-xs">HD</Badge>
                              </div>
                              <h5 className="font-semibold text-white text-sm mb-2">{trailer.title}</h5>
                              <Button 
                                size="sm" 
                                className="w-full gradient-premium hover:gradient-shift"
                                onClick={() => window.open(trailer.url, '_blank')}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Watch Trailer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Behind the Scenes Videos */}
                      {profileData.mediaContent.videos?.slice(0, 4).map((video, index) => (
                        <div key={`video-${index}`} className="relative group">
                          <div className="relative overflow-hidden rounded-2xl shadow-xl-premium hover-lift transition-all duration-300">
                            {video.thumbnail ? (
                              <div className="relative">
                                <img 
                                  src={video.thumbnail} 
                                  alt={video.title}
                                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                                    <Video className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                                <div className="p-6 bg-accent/20 backdrop-blur-sm rounded-full group-hover:bg-accent/30 transition-all duration-300">
                                  <Video className="h-12 w-12 text-accent-foreground" />
                                </div>
                              </div>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-600 text-white text-xs">VIDEO</Badge>
                                <Badge variant="secondary" className="text-xs">HD</Badge>
                              </div>
                              <h5 className="font-semibold text-white text-sm mb-2">{video.title}</h5>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                                onClick={() => window.open(video.url, '_blank')}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Watch Video
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Filmography Showcase */}
            {(profileData.credits && profileData.credits.length > 0) && (
              <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 gradient-premium rounded-xl">
                      <Film className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Complete Filmography</h3>
                      <p className="text-sm text-muted-foreground">{profileData.credits.length} credits in career</p>
                    </div>
                  </div>
                  <Badge className="gradient-premium text-white">Full Career</Badge>
                </div>
                
                {/* Featured Works */}
                {profileData.knownFor && profileData.knownFor.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-5 w-5 text-warning" />
                      Known For
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profileData.knownFor.slice(0, 4).map((work, index) => (
                        <div key={index} className="relative group p-6 rounded-2xl bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border border-warning/20 hover:border-warning/40 hover-lift transition-all duration-300 shadow-premium">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-warning/20 rounded-xl">
                              <Star className="h-6 w-6 text-warning" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="font-bold text-foreground">{work.title}</h5>
                                {work.year && (
                                  <Badge variant="outline" className="text-xs">
                                    {work.year}
                                  </Badge>
                                )}
                                {work.rating && (
                                  <Badge className="bg-warning/20 text-warning text-xs">
                                    ⭐ {work.rating}
                                  </Badge>
                                )}
                              </div>
                              {work.role && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  as {work.role}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Complete Credits List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" />
                    All Credits
                  </h4>
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {profileData.credits.map((credit, index) => (
                      <div key={index} className="group p-5 rounded-xl bg-gradient-to-r from-muted/20 to-transparent hover:from-muted/40 hover:to-muted/10 transition-all duration-300 border border-muted/20 hover:border-muted/40 hover-lift">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                              <Film className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                  {credit.title}
                                </h5>
                                {credit.year && (
                                  <Badge variant="outline" className="text-xs">
                                    {credit.year}
                                  </Badge>
                                )}
                                {credit.department && (
                                  <Badge variant="secondary" className="text-xs">
                                    {credit.department}
                                  </Badge>
                                )}
                              </div>
                              {credit.role && (
                                <p className="text-sm text-muted-foreground">
                                  {credit.role}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Personal Details & Family */}
            {profileData.personalDetails && (
              <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 gradient-premium rounded-xl">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Personal Life</h3>
                    <p className="text-sm text-muted-foreground">Family and personal details</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {profileData.personalDetails.birthYear && (
                    <div className="p-6 rounded-xl bg-gradient-to-br from-success/10 via-success/5 to-transparent border border-success/20">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="h-5 w-5 text-success" />
                        <span className="font-semibold text-foreground">Birth</span>
                      </div>
                      <p className="text-foreground">{profileData.personalDetails.birthYear}</p>
                      {profileData.personalDetails.birthPlace && (
                        <p className="text-sm text-muted-foreground mt-1">{profileData.personalDetails.birthPlace}</p>
                      )}
                    </div>
                  )}
                  
                  {profileData.personalDetails.height && (
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">Height</span>
                      </div>
                      <p className="text-foreground">{profileData.personalDetails.height}</p>
                    </div>
                  )}
                  
                  {profileData.personalDetails.relatives && profileData.personalDetails.relatives.length > 0 && (
                    <div className="md:col-span-2 p-6 rounded-xl bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border border-warning/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-5 w-5 text-warning" />
                        <span className="font-semibold text-foreground">Family</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {profileData.personalDetails.relatives.map((relative, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="font-medium text-foreground">{relative.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {relative.relationship}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Awards Section */}
            {profileData.awards && profileData.awards.length > 0 && (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 gradient-premium rounded-xl">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Awards & Recognition</h3>
                    <p className="text-sm text-muted-foreground">{profileData.awards.length} awards and nominations</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {profileData.awards.map((award, index) => (
                    <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border border-warning/20 hover:border-warning/30 hover-lift transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{award.name}</h4>
                          {award.category && (
                            <p className="text-sm text-muted-foreground mb-2">{award.category}</p>
                          )}
                          {award.year && (
                            <Badge variant="secondary" className="text-xs">
                              {award.year}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Action Buttons */}
            <div className="space-y-4 pt-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={onExport}
                  className="h-14 text-base font-bold rounded-xl gradient-premium hover:gradient-shift shadow-glow hover:shadow-xl-premium hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5" />
                    <div className="text-left">
                      <div>Export Profile</div>
                      <div className="text-xs opacity-90 font-normal">Download JSON</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={onTryAnother}
                  variant="outline"
                  className="h-14 text-base font-semibold rounded-xl hover:bg-accent/50 border-2 border-border hover:border-primary/30 hover-lift transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5" />
                    <div className="text-left">
                      <div>Try Another</div>
                      <div className="text-xs opacity-70 font-normal">New Analysis</div>
                    </div>
                  </div>
                </Button>
              </div>
              
              <p className="text-center text-xs text-muted-foreground/70 px-4">
                Comprehensive IMDB profile • {confidenceScore}% accuracy • ScrapingBee powered
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};