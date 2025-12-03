import { Star, Eye, Heart } from 'lucide-react';
import { Movie } from '../data/movies';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  showStats?: boolean;
}

export function MovieCard({ movie, onClick, showStats = true }: MovieCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-2 bg-[#1a1f29]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center px-4">
            {movie.watched && (
              <div className="flex items-center justify-center gap-1 mb-2">
                <Eye size={16} className="text-[#00c030]" />
                <span className="text-white text-sm">Vu</span>
              </div>
            )}
            {movie.userRating && (
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < movie.userRating! ? 'fill-[#00c030] text-[#00c030]' : 'text-gray-600'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating badge */}
        {showStats && (
          <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 flex items-center gap-1">
            <Star size={12} className="text-[#00c030] fill-[#00c030]" />
            <span className="text-white text-xs">{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Watched indicator */}
        {movie.watched && (
          <div className="absolute top-2 left-2 bg-black/80 rounded p-1">
            <Eye size={14} className="text-[#00c030]" />
          </div>
        )}

        {/* Liked indicator */}
        {movie.userReview?.liked && (
          <div className="absolute bottom-2 right-2 bg-black/80 rounded p-1">
            <Heart size={14} className="text-[#ff6b6b] fill-[#ff6b6b]" />
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-white text-sm group-hover:text-[#00c030] transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs">{movie.year}</p>
      </div>
    </div>
  );
}
