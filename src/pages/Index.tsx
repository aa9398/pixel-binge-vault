import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import MovieDetailModal from "@/components/MovieDetailModal";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlistMovieIds, setWatchlistMovieIds] = useState<Set<string>>(new Set());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch movies from Supabase
  useEffect(() => {
    fetchMovies();
  }, []);

  // Fetch user's watchlist
  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlistMovieIds(new Set());
    }
  }, [user]);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('title');

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Error",
        description: "Failed to load movies.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const movieIds = new Set(data?.map(item => item.movie_id) || []);
      setWatchlistMovieIds(movieIds);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const handleWatchTrailer = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsTrailerOpen(true);
  };

  const handleMovieDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDetailOpen(true);
  };

  const handleAddToWatchlist = async (movie: Movie) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add movies to your watchlist.",
        variant: "destructive",
      });
      return;
    }

    if (watchlistMovieIds.has(movie.id)) {
      toast({
        title: "Already in Watchlist",
        description: `${movie.title} is already in your watchlist.`,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          movie_id: movie.id
        });

      if (error) throw error;

      setWatchlistMovieIds(prev => new Set([...prev, movie.id]));
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to watchlist.",
        variant: "destructive",
      });
    }
  };

  const handleBuyRent = (movie: Movie) => {
    toast({
      title: "Coming Soon",
      description: `Purchase feature for ${movie.title} will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pixel-pattern">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-pixel-2xl text-primary mb-6 glow-primary">
            Discover Amazing Movies
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 font-sans">
            Experience the best in cinema with our pixelated retro interface. 
            From timeless classics to modern masterpieces, all with authentic movie data and IMDB ratings.
          </p>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="font-pixel-lg text-primary">Loading movies...</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-pixel-lg text-foreground">
                  Featured Movies
                </h2>
                <p className="text-muted-foreground font-pixel">
                  {movies.length} movies available
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onWatchTrailer={handleWatchTrailer}
                    onAddToWatchlist={handleAddToWatchlist}
                    onBuyRent={handleBuyRent}
                    onMovieDetails={handleMovieDetails}
                    isInWatchlist={watchlistMovieIds.has(movie.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modals */}
      <TrailerModal
        movie={selectedMovie}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
      
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onWatchTrailer={() => {
          setIsDetailOpen(false);
          setIsTrailerOpen(true);
        }}
        onAddToWatchlist={handleAddToWatchlist}
        onBuyRent={handleBuyRent}
      />
    </div>
  );
};

export default Index;
