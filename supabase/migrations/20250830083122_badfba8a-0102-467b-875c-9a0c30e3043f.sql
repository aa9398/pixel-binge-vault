-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create movies table with comprehensive movie data
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  release_year INTEGER,
  genre TEXT,
  poster_url TEXT,
  trailer_url TEXT,
  imdb_rating DECIMAL(3,1),
  runtime_minutes INTEGER,
  director TEXT,
  cast_members TEXT[],
  country TEXT,
  awards TEXT,
  streaming_platforms TEXT[],
  price_inr DECIMAL(10,2),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Create purchased_movies table
CREATE TABLE public.purchased_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(10,2),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchased_movies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for movies (public read access)
CREATE POLICY "movies_select_all" ON public.movies FOR SELECT USING (true);

-- RLS Policies for watchlist
CREATE POLICY "watchlist_select_own" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "watchlist_insert_own" ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchlist_delete_own" ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for purchased_movies
CREATE POLICY "purchased_select_own" ON public.purchased_movies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "purchased_insert_own" ON public.purchased_movies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON public.movies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample movies with real data (first 20 movies)
INSERT INTO public.movies (title, description, release_year, genre, poster_url, trailer_url, imdb_rating, runtime_minutes, director, cast_members, country, price_inr, streaming_platforms) VALUES 
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 'Drama', 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=NmzuHjWmXOc', 9.3, 142, 'Frank Darabont', ARRAY['Tim Robbins', 'Morgan Freeman'], 'USA', 299.00, ARRAY['Netflix', 'Prime Video']),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Crime', 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzUwODI@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=UaVTIH8mujA', 9.2, 175, 'Francis Ford Coppola', ARRAY['Marlon Brando', 'Al Pacino'], 'USA', 399.00, ARRAY['Prime Video']),
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 2008, 'Action', 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 9.0, 152, 'Christopher Nolan', ARRAY['Christian Bale', 'Heath Ledger'], 'USA', 349.00, ARRAY['Netflix', 'HBO Max']),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 1994, 'Crime', 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 8.9, 154, 'Quentin Tarantino', ARRAY['John Travolta', 'Uma Thurman'], 'USA', 299.00, ARRAY['Prime Video']),
('Fight Club', 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.', 1999, 'Drama', 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=qtRKdVHc-cE', 8.8, 139, 'David Fincher', ARRAY['Brad Pitt', 'Edward Norton'], 'USA', 249.00, ARRAY['Netflix']),
('Forrest Gump', 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.', 1994, 'Drama', 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=bLvqoHBptjg', 8.8, 142, 'Robert Zemeckis', ARRAY['Tom Hanks', 'Robin Wright'], 'USA', 299.00, ARRAY['Prime Video']),
('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 2010, 'Sci-Fi', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 8.8, 148, 'Christopher Nolan', ARRAY['Leonardo DiCaprio', 'Marion Cotillard'], 'USA', 349.00, ARRAY['Netflix', 'HBO Max']),
('The Matrix', 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth.', 1999, 'Sci-Fi', 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=vKQi3bBA1y8', 8.7, 136, 'Lana Wachowski', ARRAY['Keanu Reeves', 'Laurence Fishburne'], 'USA', 299.00, ARRAY['HBO Max']),
('Goodfellas', 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill.', 1990, 'Crime', 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=qo5jJpHtI1Y', 8.7, 146, 'Martin Scorsese', ARRAY['Robert De Niro', 'Ray Liotta'], 'USA', 349.00, ARRAY['Prime Video']),
('Star Wars: Episode IV - A New Hope', 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy.', 1977, 'Sci-Fi', 'https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg', 'https://www.youtube.com/watch?v=vZ734NWnAHA', 8.6, 121, 'George Lucas', ARRAY['Mark Hamill', 'Harrison Ford'], 'USA', 299.00, ARRAY['Disney+']),
('The Silence of the Lambs', 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', 1991, 'Thriller', 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=W6Mm8Sbe__o', 8.6, 118, 'Jonathan Demme', ARRAY['Jodie Foster', 'Anthony Hopkins'], 'USA', 279.00, ARRAY['Prime Video']),
('Saving Private Ryan', 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper.', 1998, 'War', 'https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=9CiW_DgxCnQ', 8.6, 169, 'Steven Spielberg', ARRAY['Tom Hanks', 'Matt Damon'], 'USA', 349.00, ARRAY['Prime Video']),
('The Green Mile', 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape.', 1999, 'Drama', 'https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg', 'https://www.youtube.com/watch?v=Ki4haFrqSrw', 8.6, 189, 'Frank Darabont', ARRAY['Tom Hanks', 'Michael Clarke Duncan'], 'USA', 299.00, ARRAY['Netflix']),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 2014, 'Sci-Fi', 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 8.6, 169, 'Christopher Nolan', ARRAY['Matthew McConaughey', 'Anne Hathaway'], 'USA', 399.00, ARRAY['HBO Max']),
('Casablanca', 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband.', 1942, 'Romance', 'https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=BkL9l7qovsE', 8.5, 102, 'Michael Curtiz', ARRAY['Humphrey Bogart', 'Ingrid Bergman'], 'USA', 199.00, ARRAY['HBO Max']),
('The Departed', 'An undercover cop and a police informant play a cat and mouse game with each other while infiltrating an Irish gang.', 2006, 'Crime', 'https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg', 'https://www.youtube.com/watch?v=auYbpnEwBBg', 8.5, 151, 'Martin Scorsese', ARRAY['Leonardo DiCaprio', 'Matt Damon'], 'USA', 329.00, ARRAY['Netflix']),
('The Prestige', 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.', 2006, 'Mystery', 'https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg', 'https://www.youtube.com/watch?v=o4gHCmTQDVI', 8.5, 130, 'Christopher Nolan', ARRAY['Hugh Jackman', 'Christian Bale'], 'USA', 299.00, ARRAY['Netflix']),
('Gladiator', 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.', 2000, 'Action', 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=owK1qxDselE', 8.5, 155, 'Ridley Scott', ARRAY['Russell Crowe', 'Joaquin Phoenix'], 'USA', 329.00, ARRAY['Prime Video']),
('The Lion King', 'A Lion cub crown prince is tricked by a treacherous uncle into thinking he caused his fathers death.', 1994, 'Animation', 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNjMtMmE4Mjg5MGUwYTFkXkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=lFzVJEksoDY', 8.5, 88, 'Roger Allers', ARRAY['Matthew Broderick', 'Jeremy Irons'], 'USA', 249.00, ARRAY['Disney+']),
('Back to the Future', 'Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean.', 1985, 'Sci-Fi', 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', 'https://www.youtube.com/watch?v=qvsgGtivCgs', 8.5, 116, 'Robert Zemeckis', ARRAY['Michael J. Fox', 'Christopher Lloyd'], 'USA', 249.00, ARRAY['Netflix']);