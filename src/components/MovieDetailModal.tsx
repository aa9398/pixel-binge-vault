import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, ShoppingCart, Star, Clock, Calendar, Award, Users } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  description: string;
  release_year: number;
  genre: string;
  poster_url: string;
  trailer_link: string;
  director: string;
  cast_members: string[];
  awards: string;
  imdb_rating: number;
  runtime_minutes: number;
  price: number;
  country: string;
  streaming_platforms: string[];
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
  onBuyRent 
}: MovieDetailModalProps) => {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto movie-card border-2">
        <DialogHeader>
          <DialogTitle className="font-retro-lg text-primary">{movie.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Poster */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => onWatchTrailer(movie)}
                className="btn-retro-primary w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Trailer
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={() => onAddToWatchlist(movie)}
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Watchlist
                </Button>
                <Button
                  onClick={() => onBuyRent(movie)}
                  className="btn-retro-primary flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  ₹{movie.price}
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Rating & Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-bold text-lg">{movie.imdb_rating}/10</span>
                <span className="text-sm text-muted-foreground">IMDb</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{movie.runtime_minutes} min</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{movie.release_year}</span>
              </div>
              <Badge variant="secondary" className="w-fit">
                {movie.genre}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-retro mb-2 text-foreground">Plot</h3>
              <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
            </div>

            {/* Director */}
            <div>
              <h3 className="font-retro mb-2 text-foreground">Director</h3>
              <p className="text-foreground">{movie.director}</p>
            </div>

            {/* Cast */}
            <div>
              <h3 className="font-retro mb-2 text-foreground flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Cast
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast_members.map((actor, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Awards */}
            {movie.awards && (
              <div>
                <h3 className="font-retro mb-2 text-foreground flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Awards
                </h3>
                <p className="text-muted-foreground text-sm">{movie.awards}</p>
              </div>
            )}

            {/* Streaming Platforms */}
            <div>
              <h3 className="font-retro mb-2 text-foreground">Available On</h3>
              <div className="flex flex-wrap gap-2">
                {movie.streaming_platforms.map((platform, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span className="text-sm">Country: {movie.country}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailModal;