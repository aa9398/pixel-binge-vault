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

const streamingPlatforms: StreamingPlatform[] = [
  { name: "Netflix", icon: "netflix" },
  { name: "Prime Video", icon: "prime" },
  { name: "Disney+", icon: "disney" },
  { name: "HBO Max", icon: "hbo" },
  { name: "Hulu", icon: "hulu" },
  { name: "Apple TV+", icon: "apple" },
];

const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
  "Drama", "Family", "Fantasy", "Horror", "Mystery", "Romance", 
  "Sci-Fi", "Thriller", "War", "Western"
];

const generateMockMovies = (): Movie[] => {
  const movies: Movie[] = [];
  
  const movieTitles = [
    "Digital Shadows", "Neon Dreams", "Cyber Pulse", "Retro Future", "Code Warriors",
    "Pixel Paradise", "Electric Nights", "Chrome Hearts", "Binary Love", "Synthwave",
    "Digital Frontier", "Neon Nights", "Cyber Dreams", "Pixel Storm", "Electric Soul",
    "Chrome City", "Binary Stars", "Synth Paradise", "Digital Rain", "Neon Pulse",
    "Cyber Nights", "Pixel Warriors", "Electric Dreams", "Chrome Future", "Binary Moon",
    "Synth City", "Digital Storm", "Neon Paradise", "Cyber Soul", "Pixel Dreams",
    "Electric Rain", "Chrome Nights", "Binary Paradise", "Synth Storm", "Digital Pulse",
    "Neon Warriors", "Cyber Paradise", "Pixel Rain", "Electric Future", "Chrome Dreams",
    "Binary Nights", "Synth Soul", "Digital Paradise", "Neon Storm", "Cyber Rain",
    "Pixel Future", "Electric Paradise", "Chrome Soul", "Binary Dreams", "Synth Rain",
    "Digital Nights", "Neon Future", "Cyber Paradise", "Pixel Soul", "Electric Storm",
    "Chrome Paradise", "Binary Future", "Synth Dreams", "Digital Soul", "Neon Rain",
    "Cyber Storm", "Pixel Paradise", "Electric Nights", "Chrome Rain", "Binary Soul",
    "Synth Future", "Digital Dreams", "Neon Paradise", "Cyber Rain", "Pixel Storm",
    "Electric Soul", "Chrome Paradise", "Binary Rain", "Synth Nights", "Digital Future",
    "Neon Soul", "Cyber Dreams", "Pixel Rain", "Electric Paradise", "Chrome Storm",
    "Binary Paradise", "Synth Soul", "Digital Rain", "Neon Future", "Cyber Paradise",
    "Pixel Dreams", "Electric Rain", "Chrome Soul", "Binary Storm", "Synth Paradise",
    "Digital Soul", "Neon Rain", "Cyber Future", "Pixel Paradise", "Electric Dreams",
    "Chrome Rain", "Binary Soul", "Synth Storm", "Digital Paradise", "Neon Dreams"
  ];

  for (let i = 0; i < 100; i++) {
    const randomPlatforms = streamingPlatforms
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    movies.push({
      id: i + 1,
      title: movieTitles[i],
      description: `An epic ${genres[Math.floor(Math.random() * genres.length)].toLowerCase()} adventure that takes you on a journey through time and space. Experience stunning visuals and heart-pounding action in this unforgettable cinematic masterpiece.`,
      release_year: 2015 + Math.floor(Math.random() * 9),
      genre: genres[Math.floor(Math.random() * genres.length)],
      poster: `/api/placeholder/300/450?text=${encodeURIComponent(movieTitles[i])}&bg=1a1a1a&color=8b5cf6`,
      trailer_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll as placeholder
      available_on: randomPlatforms,
      price: Math.floor(Math.random() * 15) + 5, // $5-$19
    });
  }

  return movies;
};

export const movies = generateMockMovies();
export type { Movie, StreamingPlatform };