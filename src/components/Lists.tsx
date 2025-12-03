import { Plus, Lock, Globe, Heart } from 'lucide-react';
import { movies } from '../data/movies';
import { MovieCard } from './MovieCard';

interface ListsProps {
  onMovieClick: (movieId: number) => void;
}

export function Lists({ onMovieClick }: ListsProps) {
  const lists = [
    {
      id: 1,
      name: "Mes films préférés de 2024",
      description: "Une sélection personnelle des meilleurs films de l'année",
      movieCount: 8,
      isPublic: true,
      likes: 24,
      movies: movies.filter(m => m.year >= 2019).slice(0, 4),
    },
    {
      id: 2,
      name: "Chefs-d'œuvre de science-fiction",
      description: "Les films de SF qui ont marqué l'histoire du cinéma",
      movieCount: 12,
      isPublic: true,
      likes: 156,
      movies: movies.filter(m => m.genre.includes('Science-Fiction')).slice(0, 4),
    },
    {
      id: 3,
      name: "À regarder ce week-end",
      description: "Films à voir prochainement",
      movieCount: 5,
      isPublic: false,
      likes: 0,
      movies: movies.slice(6, 10),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl mb-2">Mes listes</h1>
          <p className="text-gray-400">Organisez vos films en collections personnalisées</p>
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

            {list.movieCount > 4 && (
              <div className="mt-4 text-center">
                <button className="text-[#00c030] hover:opacity-80 text-sm">
                  Voir les {list.movieCount - 4} films restants
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
          <p className="text-gray-400 mb-6">Créez votre première liste pour organiser vos films</p>
          <button className="px-6 py-3 bg-[#00c030] text-white rounded-md hover:bg-[#00d436] transition-colors">
            Créer une liste
          </button>
        </div>
      )}

      {/* Popular Lists Section */}
      <section className="mt-12">
        <h2 className="text-white text-2xl mb-6">Listes populaires de la communauté</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1f29] rounded-lg p-6 hover:bg-[#1f242e] transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                alt="User"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white text-lg mb-1">Les meilleurs films noirs</h3>
                <p className="text-gray-400 text-sm mb-2">Par Sophie Martin</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>42 films</span>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>892 J'aime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f29] rounded-lg p-6 hover:bg-[#1f242e] transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
                alt="User"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white text-lg mb-1">Cinéma d'auteur français</h3>
                <p className="text-gray-400 text-sm mb-2">Par Alexandre Dubois</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>38 films</span>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>654 J'aime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
