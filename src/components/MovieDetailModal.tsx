import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, ShoppingCart, Star, Clock, Calendar, MapPin, Award, Users, X } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  description: string | null;
  release_year: number | null;
  genre: string | null;
  poster_url: string | null;
  trailer_url: string | null;
  imdb_rating: number | null;
  runtime_minutes: number | null;
  director: string | null;
  cast_members: string[] | null;
  country: string | null;
  streaming_platforms: string[] | null;
  price_inr: number | null;
  is_premium: boolean | null;
}

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onWatchTrailer: (movie: Movie) => void;
  onAddToWatchlist: (movie: Movie) => void;
  onBuyRent: (movie: Movie) => void;
}

const MovieDetailModal = ({
  movie,
  isOpen,
  onClose,
  onWatchTrailer,
  onAddToWatchlist,
  onBuyRent,
}: MovieDetailModalProps) => {
  if (!movie) return null;

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-2 border-border p-0">
        {/* Header with Poster and Basic Info */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Poster */}
            <div className="flex justify-center md:justify-start">
              <div className="movie-card w-full max-w-[300px] aspect-[2/3] overflow-hidden">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="font-pixel text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <DialogHeader>
                  <DialogTitle className="font-pixel-xl text-foreground mb-2">
                    {movie.title}
                  </DialogTitle>
                </DialogHeader>
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {movie.release_year && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {movie.release_year}
                    </div>
                  )}
                  
                  {movie.runtime_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatRuntime(movie.runtime_minutes)}
                    </div>
                  )}
                  
                  {movie.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {movie.country}
                    </div>
                  )}
                  
                  {movie.imdb_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {movie.imdb_rating}/10
                    </div>
                  )}
                </div>

                {/* Genre Badge */}
                {movie.genre && (
                  <Badge variant="secondary" className="mb-4 font-pixel">
                    {movie.genre}
                  </Badge>
                )}

                {/* Description */}
                {movie.description && (
                  <p className="text-foreground leading-relaxed font-sans">
                    {movie.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => onWatchTrailer(movie)}
                  className="btn-pixel-primary"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Trailer
                </Button>
                
                <Button
                  onClick={() => onAddToWatchlist(movie)}
                  className="btn-pixel-ghost"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </Button>
                
                {movie.price_inr && (
                  <Button
                    onClick={() => onBuyRent(movie)}
                    className="btn-pixel"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy/Rent ₹{movie.price_inr}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-background text-foreground rounded border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Additional Details */}
        <div className="border-t border-border p-6 space-y-6">
          
          {/* Cast and Crew */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {movie.director && (
              <div>
                <h3 className="font-pixel text-foreground mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Director
                </h3>
                <p className="text-muted-foreground font-sans">{movie.director}</p>
              </div>
            )}

            {movie.cast_members && movie.cast_members.length > 0 && (
              <div>
                <h3 className="font-pixel text-foreground mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Cast
                </h3>
                <p className="text-muted-foreground font-sans">
                  {movie.cast_members.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Streaming Platforms */}
          {movie.streaming_platforms && movie.streaming_platforms.length > 0 && (
            <div>
              <h3 className="font-pixel text-foreground mb-3">Available On</h3>
              <div className="flex flex-wrap gap-2">
                {movie.streaming_platforms.map((platform, index) => (
                  <Badge key={index} variant="outline" className="font-sans">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Premium Badge */}
          {movie.is_premium && (
            <div className="text-center">
              <Badge className="bg-gradient-primary text-primary-foreground font-pixel">
                Premium Content
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailModal;