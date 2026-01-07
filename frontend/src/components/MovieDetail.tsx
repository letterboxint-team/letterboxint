import { useEffect, useState } from 'react';
import { Star, Eye, Heart, Clock, Plus, Check } from 'lucide-react';
import { Movie } from '../data/movies';
import { UiReview } from '../api/backend';
import { MovieCard } from './MovieCard';
import { ReviewCard } from './ReviewCard';
import { useParams } from "react-router-dom";


interface MovieDetailProps {
  movies: Movie[];
  reviews: UiReview[];
  canReview: boolean;
  onCreateReview: (payload: {
    movie_id: number;
    note_visual: number;
    note_action: number;
    note_scenario: number;
    favorite?: boolean;
  }) => void;
  onMovieClick: (movieId: number) => void;
}

export function MovieDetail({
  movies,
  reviews,
  canReview,
  onCreateReview,
  onMovieClick,
}: MovieDetailProps) {
  const { movieId } = useParams();
  const movie = movies.find((item) => item.id === Number(movieId));
  const movieReviews = reviews.filter((review) => review.movieId === Number(movieId));

  const [userRating, setUserRating] = useState(movie?.userRating || 0);
  const [isWatched, setIsWatched] = useState(movie?.watched || movieReviews.length > 0);
  const [isLiked, setIsLiked] = useState(movieReviews.some((review) => review.favorite));
  const [hoveredStar, setHoveredStar] = useState(0);
  const [form, setForm] = useState({
    note_visual: 3,
    note_action: 3,
    note_scenario: 3,
    favorite: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUserRating(movie?.userRating || 0);
    setIsWatched(movie?.watched || movieReviews.length > 0);
    setIsLiked(movieReviews.some((review) => review.favorite));
  }, [movieId, movie, movieReviews]);

  if (!movie) {
    return (
      <div className="text-white text-center py-20">
        Film non trouvé dans les données du backend.
      </div>
    );
  }

  const similarMovies = movies
    // .filter((m) => m.id !== movieId && m.genre.some((g) => movie.genre.includes(g)))
    // removed the m.id !== movieId check
    // maybe to re include later
    .filter((m) => m.genre.some((g) => movie.genre.includes(g)))
    .slice(0, 6);

  const averageNote = Number(movie.rating || 0).toFixed(1);
  const runtimeText = movie.runtime ? `${movie.runtime} min` : 'Durée inconnue';
  const genres = movie.genre.length > 0 ? movie.genre : ['Genre non renseigné'];

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="relative h-[600px] mb-8">
        <div className="absolute inset-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover blur-2xl opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#14181c]/50 via-[#14181c]/80 to-[#14181c]" />
        </div>

        <div className="container mx-auto px-4 relative h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="w-full md:w-64 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-white text-5xl mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 mb-4 text-gray-400">
                <span>{movie.year || 'Année inconnue'}</span>
                <span>•</span>
                <span>Réalisé par {movie.director}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{runtimeText}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre) => (
                  <span key={genre} className="bg-[#1a1f29] text-gray-300 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Note moyenne (backend)</div>
                  <div className="flex items-center gap-2">
                    <Star className="text-[#00c030] fill-[#00c030]" size={24} />
                    <span className="text-white text-2xl">{averageNote}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1">Votre note</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setUserRating(star)}
                      >
                        <Star
                          size={20}
                          className={
                            star <= (hoveredStar || userRating)
                              ? 'text-[#00c030] fill-[#00c030]'
                              : 'text-gray-600'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsWatched(!isWatched)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isWatched
                      ? 'bg-[#00c030] text-white'
                      : 'bg-[#1a1f29] text-gray-300 hover:bg-[#2c3440]'
                  }`}
                >
                  {isWatched ? <Check size={18} /> : <Eye size={18} />}
                  {isWatched ? 'Vu' : 'Marquer comme vu'}
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isLiked
                      ? 'bg-[#ff6b6b] text-white'
                      : 'bg-[#1a1f29] text-gray-300 hover:bg-[#2c3440]'
                  }`}
                >
                  <Heart size={18} className={isLiked ? 'fill-white' : ''} />
                  J'aime
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1f29] text-gray-300 rounded-md hover:bg-[#2c3440] transition-colors">
                  <Plus size={18} />
                  Ajouter à une liste
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Synopsis */}
        <section className="mb-12">
          <h2 className="text-white text-2xl mb-4">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            {movie.synopsis || 'Synopsis non disponible pour ce film.'}
          </p>
        </section>

        {/* Cast */}
        <section className="mb-12">
          <h2 className="text-white text-2xl mb-4">Distribution</h2>
          {movie.cast.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {movie.cast.map((actor) => (
                <span key={actor} className="bg-[#1a1f29] text-gray-300 px-4 py-2 rounded-md">
                  {actor}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucune distribution renseignée.</p>
          )}
        </section>

        {/* Reviews */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-white text-2xl">Critiques du backend</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Star size={16} className="text-[#00c030]" />
              <span>{movieReviews.length} critique(s)</span>
            </div>
          </div>
          {canReview ? (
            <div className="bg-[#1a1f29] rounded-lg p-4 mb-4">
              <h3 className="text-white mb-3">Publier une critique</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['note_visual', 'note_action', 'note_scenario'] as const).map((field) => (
                  <label key={field} className="text-gray-300 text-sm flex flex-col gap-1">
                    {field.replace('note_', 'Note ')} (0-5)
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={form[field]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }))
                      }
                      className="bg-[#14181c] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00c030]"
                    />
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={form.favorite}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, favorite: e.target.checked }))
                    }
                    className="accent-[#00c030]"
                  />
                  Coup de coeur
                </label>
                <button
                  disabled={submitting}
                  onClick={async () => {
                    setSubmitting(true);
                    await onCreateReview({
                      movie_id: movieId,
                      note_visual: form.note_visual,
                      note_action: form.note_action,
                      note_scenario: form.note_scenario,
                      favorite: form.favorite,
                    });
                    setSubmitting(false);
                  }}
                  className="px-4 py-2 bg-[#00c030] text-white rounded-md hover:bg-[#00d436] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Envoi...' : 'Publier'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mb-4">
              Connectez-vous pour publier une critique.
            </p>
          )}
          {movieReviews.length > 0 ? (
            <div className="space-y-4">
              {movieReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              Aucune critique n'a encore été publiée pour ce film via l'API FastAPI.
            </p>
          )}
        </section>

        {/* Similar movies */}
        {similarMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-white text-2xl mb-4">Films similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((similar) => (
                <MovieCard
                  key={similar.id}
                  movie={similar}
                  onClick={() => onMovieClick(similar.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
