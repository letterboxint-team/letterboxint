import { Plus, Lock, Globe, Heart } from 'lucide-react';
import { Movie } from '../data/movies';
import { MovieCard } from './MovieCard';

interface ListsProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

export function Lists({ movies, onMovieClick }: ListsProps) {
  const topRated = [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  const recentReleases = [...movies].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 4);
  const backendLists = movies.length
    ? [
      {
        id: 1,
        name: 'Top notés',
        description: 'Classement basé sur les notes agrégées du backend',
        movieCount: movies.length,
        isPublic: true,
        likes: movies.length * 3,
        movies: topRated,
      },
      {
        id: 2,
        name: 'Derniers ajouts',
        description: 'Triés par année de sortie depuis l’API FastAPI',
        movieCount: movies.length,
        isPublic: true,
        likes: Math.max(5, movies.length * 2),
        movies: recentReleases,
      },
    ]
    : [];

  const lists = backendLists;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl mb-2">Les listes</h1>
          <p className="text-gray-400">Les listes sont générées à partir des films remontés par le backend</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-[#00c030] text-white rounded-md hover:bg-[#00d436] transition-colors">
          <Plus size={20} />
          Nouvelle liste
        </button>
      </div>

      {/* Lists */}
      <div className="space-y-8">
        {lists.map((list) => (
          <div key={list.id} className="bg-[#1a1f29] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-white text-2xl">{list.name}</h2>
                  {list.isPublic ? (
                    <Globe size={18} className="text-[#00c030]" />
                  ) : (
                    <Lock size={18} className="text-gray-400" />
                  )}
                </div>
                <p className="text-gray-400 mb-2">{list.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{list.movieCount} films</span>
                  {list.isPublic && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart size={14} />
                      <span>{list.likes} J'aime</span>
                    </div>
                  )}
                </div>
              </div>

              <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Modifier
              </button>
            </div>

            {/* Movie Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {list.movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => onMovieClick(movie.id)}
                  showStats={false}
                />
              ))}
            </div>

            {list.movieCount > list.movies.length && (
              <div className="mt-4 text-center">
                <button className="text-[#00c030] hover:opacity-80 text-sm">
                  Voir les {list.movieCount - list.movies.length} films restants
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {lists.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a1f29] rounded-full mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h2 className="text-white text-2xl mb-2">Aucune liste pour le moment</h2>
          <p className="text-gray-400 mb-6">
            Ajoutez des films via le backend pour générer vos premières listes dynamiques.
          </p>
          <button className="px-6 py-3 bg-[#00c030] text-white rounded-md hover:bg-[#00d436] transition-colors">
            Créer une liste
          </button>
        </div>
      )}
    </div>
  );
}
