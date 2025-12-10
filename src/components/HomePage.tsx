import { MovieCard } from './MovieCard';
import { Movie } from '../data/movies';
import { UiReview } from '../api/backend';

interface HomePageProps {
  movies: Movie[];
  reviews: UiReview[];
  onMovieClick: (movieId: number) => void;
}

export function HomePage({ movies, reviews, onMovieClick }: HomePageProps) {
  const popularMovies = [...movies]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  const moviesById = new Map(movies.map((movie) => [movie.id, movie]));

  const recentlyWatched = Array.from(
    new Map(
      reviews
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .map((review) => [review.movieId, moviesById.get(review.movieId)])
    ).values()
  )
    .filter(Boolean)
    .slice(0, 6) as Movie[];

  const newReleases = [...movies]
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 6);

  const watchedCount = new Set(reviews.map((review) => review.movieId)).size;
  const reviewCount = reviews.length;
  const averageRating =
    movies.length > 0
      ? (
          movies.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          movies.length
        ).toFixed(1)
      : '0';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/60 to-transparent flex items-end">
            <div className="p-8 pb-12">
              <h1 className="text-white text-5xl mb-4">
                Suivez vos films. <br />
                Partagez votre passion.
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                Découvrez, notez et partagez vos films préférés avec une communauté de cinéphiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {movies.length === 0 && (
        <div className="bg-[#1a1f29] rounded-lg p-8 text-center text-gray-300 mb-12">
          Aucun film n'est disponible pour le moment. Ajoutez-en via l'API FastAPI pour remplir
          cette page.
        </div>
      )}

      {/* Popular this week */}
      {popularMovies.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl">Populaires cette semaine</h2>
            <button className="text-[#00c030] text-sm hover:opacity-80">
              Voir tout
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Watched */}
      {recentlyWatched.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl">Récemment visionnés</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyWatched.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)} />
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      {newReleases.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl">Nouveautés</h2>
            <button className="text-[#00c030] text-sm hover:opacity-80">
              Voir tout
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newReleases.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-[#1a1f29] rounded-lg p-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-[#00c030] text-4xl mb-2">{watchedCount}</div>
            <div className="text-gray-400">Films visionnés (via le backend)</div>
          </div>
          <div>
            <div className="text-[#00c030] text-4xl mb-2">{reviewCount}</div>
            <div className="text-gray-400">Critiques stockées</div>
          </div>
          <div>
            <div className="text-[#00c030] text-4xl mb-2">{averageRating}</div>
            <div className="text-gray-400">Note moyenne calculée</div>
          </div>
        </div>
      </section>
    </div>
  );
}
