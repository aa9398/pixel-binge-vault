import { useState } from "react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import { movies, type Movie } from "@/data/movies";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { toast } = useToast();

  const handleWatchTrailer = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsTrailerOpen(true);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    toast({
      title: "Added to Watchlist",
      description: `${movie.title} has been added to your watchlist.`,
    });
  };

  const handleBuyRent = (movie: Movie) => {
    toast({
      title: "Purchase Required",
      description: `Connect to Supabase to enable purchases for ${movie.title}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-retro-xl text-primary mb-4">
            Discover Amazing Movies
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Experience the best in cinema with our curated collection of movies. 
            From timeless classics to modern masterpieces.
          </p>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-retro-lg text-foreground">
              Featured Movies
            </h2>
            <p className="text-muted-foreground">
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        movie={selectedMovie}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </div>
  );
};

export default Index;
