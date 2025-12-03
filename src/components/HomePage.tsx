import { MovieCard } from './MovieCard';
import { movies } from '../data/movies';

interface HomePageProps {
  onMovieClick: (movieId: number) => void;
}

export function HomePage({ onMovieClick }: HomePageProps) {
  const popularMovies = movies.filter(m => m.rating >= 4.0);
  const recentlyWatched = movies.filter(m => m.watched).slice(0, 6);
  const newReleases = [...movies].sort((a, b) => b.year - a.year).slice(0, 6);

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

      {/* Popular this week */}
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

      {/* Stats Section */}
      <section className="bg-[#1a1f29] rounded-lg p-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-[#00c030] text-4xl mb-2">12</div>
            <div className="text-gray-400">Films visionnés</div>
          </div>
          <div>
            <div className="text-[#00c030] text-4xl mb-2">3</div>
            <div className="text-gray-400">Critiques écrites</div>
          </div>
          <div>
            <div className="text-[#00c030] text-4xl mb-2">4.2</div>
            <div className="text-gray-400">Note moyenne</div>
          </div>
        </div>
      </section>
    </div>
  );
}
