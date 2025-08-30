import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import TrailerModal from '@/components/TrailerModal';
import MovieDetailModal from '@/components/MovieDetailModal';
import { Heart, Trash2 } from 'lucide-react';

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

const Watchlist = () => {
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch watchlist movies
  useEffect(() => {
    if (user) {
      fetchWatchlistMovies();
    }
  }, [user]);

  const fetchWatchlistMovies = async () => {
    try {
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('watchlist')
        .select(`
          movie_id,
          movies (
            id,
            title,
            description,
            release_year,
            genre,
            poster_url,
            trailer_url,
            imdb_rating,
            runtime_minutes,
            director,
            cast_members,
            country,
            streaming_platforms,
            price_inr,
            is_premium
          )
        `)
        .eq('user_id', user?.id);

      if (watchlistError) throw watchlistError;

      const movies = watchlistData?.map(item => item.movies).filter(Boolean) as Movie[];
      setWatchlistMovies(movies || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to load watchlist.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleRemoveFromWatchlist = async (movie: Movie) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movie.id);

      if (error) throw error;

      setWatchlistMovies(prev => prev.filter(m => m.id !== movie.id));
      toast({
        title: "Removed from Watchlist",
        description: `${movie.title} has been removed from your watchlist.`,
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist.",
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pixel-pattern">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="font-pixel-2xl text-primary">My Watchlist</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              Your carefully curated collection of movies to watch
            </p>
          </div>
        </div>
      </section>

      {/* Watchlist Content */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="font-pixel text-primary">Loading your watchlist...</div>
            </div>
          ) : watchlistMovies.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-pixel-lg text-foreground mb-4">Your watchlist is empty</h3>
              <p className="text-muted-foreground mb-6 font-sans">
                Start adding movies to your watchlist to keep track of what you want to watch.
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-pixel-primary"
              >
                Browse Movies
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-pixel-lg text-foreground">
                  {watchlistMovies.length} {watchlistMovies.length === 1 ? 'Movie' : 'Movies'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {watchlistMovies.map((movie) => (
                  <div key={movie.id} className="relative group">
                    <MovieCard
                      movie={movie}
                      onWatchTrailer={handleWatchTrailer}
                      onAddToWatchlist={() => {}} // Already in watchlist
                      onBuyRent={handleBuyRent}
                      onMovieDetails={handleMovieDetails}
                      isInWatchlist={true}
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWatchlist(movie)}
                      className="absolute top-2 right-2 p-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
        onAddToWatchlist={() => {}}
        onBuyRent={handleBuyRent}
      />
    </div>
  );
};

export default Watchlist;