import { useMemo, useState } from 'react';
import { Star, Eye, Heart, Calendar } from 'lucide-react';
import { Movie } from '../data/movies';
import { ApiUser, UiReview } from '../api/backend';
import { MovieCard } from './MovieCard';

interface UserProfileProps {
  movies: Movie[];
  reviews: UiReview[];
  activeUser: ApiUser | null;
  onMovieClick: (movieId: number) => void;
}

export function UserProfile({ movies, reviews, activeUser, onMovieClick }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'watched' | 'rated' | 'reviews'>('watched');
  if (!activeUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-400">
        Aucun utilisateur n'a été renvoyé par le backend. Ajoutez un utilisateur via l'API.
      </div>
    );
  }

  const moviesById = useMemo(() => new Map(movies.map((movie) => [movie.id, movie])), [movies]);

  const userReviews = reviews.filter((review) =>
    activeUser.id ? review.userId === activeUser.id : true
  );
  const watchedMovies = userReviews
    .map((review) => moviesById.get(review.movieId))
    .filter(Boolean) as Movie[];
  const ratedMovies = watchedMovies;

  const averageRating =
    userReviews.length > 0
      ? (userReviews.reduce((sum, review) => sum + review.averageRating, 0) / userReviews.length).toFixed(1)
      : '0';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-[#1a1f29] rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-[#00c030] rounded-full flex items-center justify-center text-white text-4xl">
            {activeUser.username.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-white text-3xl mb-2">{activeUser.username}</h1>
            <p className="text-gray-400 mb-4">
              Données issues du backend
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-[#00c030]" />
                <div>
                  <div className="text-white text-xl">{watchedMovies.length}</div>
                  <div className="text-gray-400 text-sm">Films vus</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star size={20} className="text-[#00c030]" />
                <div>
                  <div className="text-white text-xl">{averageRating}</div>
                  <div className="text-gray-400 text-sm">Note moyenne</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Heart size={20} className="text-[#ff6b6b]" />
                <div>
                  <div className="text-white text-xl">{userReviews.length}</div>
                  <div className="text-gray-400 text-sm">Critiques</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-[#00c030]" />
                <div>
                  <div className="text-white text-xl">
                    {activeUser.created_at?.slice(0, 4) || '2024'}
                  </div>
                  <div className="text-gray-400 text-sm">Membre depuis</div>
                </div>
              </div>
            </div>
          </div>

          <button className="px-6 py-2 bg-[#00c030] text-white rounded-md hover:bg-[#00d436] transition-colors">
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2c3440] mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('watched')}
            className={`pb-4 relative ${
              activeTab === 'watched' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Films vus ({watchedMovies.length})
            {activeTab === 'watched' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c030]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('rated')}
            className={`pb-4 relative ${
              activeTab === 'rated' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Films notés ({ratedMovies.length})
            {activeTab === 'rated' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c030]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 relative ${
              activeTab === 'reviews' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Critiques ({userReviews.length})
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c030]" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'watched' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)} />
          ))}
          {watchedMovies.length === 0 && (
            <p className="text-gray-400 col-span-full">
              Aucun film marqué comme vu pour ce profil.
            </p>
          )}
        </div>
      )}

      {activeTab === 'rated' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ratedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)} />
          ))}
          {ratedMovies.length === 0 && (
            <p className="text-gray-400 col-span-full">
              Ajoutez des notes via le backend pour alimenter cette section.
            </p>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {userReviews.map((review) => {
            const movie = moviesById.get(review.movieId);
            if (!movie) return null;
            return (
              <div key={review.id} className="bg-[#1a1f29] rounded-lg p-6">
                <div className="flex gap-6">
                  <div className="w-24 flex-shrink-0">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onMovieClick(movie.id)}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className="text-white text-xl hover:text-[#00c030] cursor-pointer transition-colors"
                          onClick={() => onMovieClick(movie.id)}
                        >
                          {movie.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {movie.year} · {movie.director}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < Math.round(review.averageRating)
                                ? 'fill-[#00c030] text-[#00c030]'
                                : 'text-gray-600'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-2">
                      Visuel {review.breakdown.visual}/5 · Action {review.breakdown.action}/5 ·
                      Scénario {review.breakdown.scenario}/5
                    </p>
                    <p className="text-gray-400 text-sm">{review.date}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {userReviews.length === 0 && (
            <p className="text-gray-400">Aucune critique pour le moment.</p>
          )}
        </div>
      )}

      {/* Favorite Genres */}
      <section className="mt-12 bg-[#1a1f29] rounded-lg p-8">
        <h2 className="text-white text-2xl mb-6">Genres préférés</h2>
        {movies.length === 0 && (
          <p className="text-gray-400">Aucun film associé pour calculer les genres préférés.</p>
        )}
        {movies.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {Array.from(
              movies
                .flatMap((movie) => movie.genre)
                .reduce((acc, genre) => {
                  acc.set(genre, (acc.get(genre) || 0) + 1);
                  return acc;
                }, new Map<string, number>())
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([genre]) => (
                <div key={genre} className="bg-[#14181c] px-4 py-2 rounded-full">
                  <span className="text-gray-300">{genre}</span>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
