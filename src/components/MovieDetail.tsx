import { Star, Eye, Heart, Clock, Calendar, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { movies, Movie } from '../data/movies';
import { MovieCard } from './MovieCard';
import { ReviewCard } from './ReviewCard';

interface MovieDetailProps {
  movieId: number;
  onMovieClick: (movieId: number) => void;
}

export function MovieDetail({ movieId, onMovieClick }: MovieDetailProps) {
  const movie = movies.find(m => m.id === movieId);
  const [userRating, setUserRating] = useState(movie?.userRating || 0);
  const [isWatched, setIsWatched] = useState(movie?.watched || false);
  const [isLiked, setIsLiked] = useState(movie?.userReview?.liked || false);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!movie) {
    return <div className="text-white text-center py-20">Film non trouvé</div>;
  }

  // Similar movies
  const similarMovies = movies
    .filter(m => m.id !== movieId && m.genre.some(g => movie.genre.includes(g)))
    .slice(0, 6);

  // Mock reviews from other users
  const otherReviews = [
    {
      id: 1,
      user: "Marie D.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      text: "Un film magnifique qui reste gravé dans la mémoire. La réalisation est impeccable et l'histoire profondément touchante.",
      date: "2024-11-25",
      liked: true,
      likes: 42
    },
    {
      id: 2,
      user: "Thomas L.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 4,
      text: "Excellent film, même si certaines longueurs se font sentir. La photographie est à couper le souffle.",
      date: "2024-11-20",
      liked: false,
      likes: 28
    },
  ];

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
                <span>{movie.year}</span>
                <span>•</span>
                <span>Réalisé par {movie.director}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{movie.runtime} min</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g) => (
                  <span key={g} className="bg-[#1a1f29] text-gray-300 px-3 py-1 rounded-full text-sm">
                    {g}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Note moyenne</div>
                  <div className="flex items-center gap-2">
                    <Star className="text-[#00c030] fill-[#00c030]" size={24} />
                    <span className="text-white text-2xl">{movie.rating.toFixed(1)}</span>
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
          <p className="text-gray-300 leading-relaxed max-w-3xl">{movie.synopsis}</p>
        </section>

        {/* Cast */}
        <section className="mb-12">
          <h2 className="text-white text-2xl mb-4">Distribution</h2>
          <div className="flex flex-wrap gap-3">
            {movie.cast.map((actor) => (
              <span key={actor} className="bg-[#1a1f29] text-gray-300 px-4 py-2 rounded-md">
                {actor}
              </span>
            ))}
          </div>
        </section>

        {/* User Review */}
        {movie.userReview && (
          <section className="mb-12">
            <h2 className="text-white text-2xl mb-4">Votre critique</h2>
            <div className="bg-[#1a1f29] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < movie.userReview!.rating ? 'fill-[#00c030] text-[#00c030]' : 'text-gray-600'}
                  />
                ))}
                <span className="text-gray-400 text-sm ml-2">{movie.userReview.date}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{movie.userReview.text}</p>
            </div>
          </section>
        )}

        {/* Other Reviews */}
        <section className="mb-12">
          <h2 className="text-white text-2xl mb-4">Critiques populaires</h2>
          <div className="space-y-4">
            {otherReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section>
            <h2 className="text-white text-2xl mb-4">Films similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((m) => (
                <MovieCard key={m.id} movie={m} onClick={() => onMovieClick(m.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
