import { Play, Heart, ShoppingCart, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StreamingPlatform {
  name: string;
  icon: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  release_year: number;
  genre: string;
  poster: string;
  trailer_url: string;
  available_on: StreamingPlatform[];
  price: number;
}

interface MovieCardProps {
  movie: Movie;
  onWatchTrailer: (movie: Movie) => void;
  onAddToWatchlist: (movie: Movie) => void;
  onBuyRent: (movie: Movie) => void;
}

const MovieCard = ({ movie, onWatchTrailer, onAddToWatchlist, onBuyRent }: MovieCardProps) => {
  return (
    <div className="movie-card group">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Streaming platforms */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {movie.available_on.map((platform, index) => (
            <div
              key={index}
              className="bg-black/70 backdrop-blur-sm rounded p-1 text-xs text-white opacity-60"
              title={platform.name}
            >
              <Tv className="h-3 w-3" />
            </div>
          ))}
        </div>

        {/* Hover overlay with trailer button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={() => onWatchTrailer(movie)}
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Trailer
          </Button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{movie.release_year}</span>
            <Badge variant="secondary" className="text-xs">
              {movie.genre}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {movie.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={() => onAddToWatchlist(movie)}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => onBuyRent(movie)}
            className="btn-retro-primary text-xs px-3 py-1.5"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            ${movie.price}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;