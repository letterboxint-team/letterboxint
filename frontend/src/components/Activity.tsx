import { useEffect, useState } from 'react';
import { Star, Eye, List, Clock } from 'lucide-react';
import { Movie } from '../data/movies';
import { UiReview, ApiUser, fetchFriends } from '../api/backend';

interface ActivityProps {
  movies: Movie[];
  reviews: UiReview[];
  onMovieClick: (movieId: number) => void;
  activeUser: ApiUser | null;
}

type ActivityItem = {
  id: number;
  type: 'review' | 'watched' | 'rating' | 'list';
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  movie?: Movie;
  rating?: number;
  time: string;
  liked?: boolean;
  breakdown?: UiReview['breakdown'];
  listName?: string;
  movieCount?: number;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
}

export function Activity({ movies, reviews, onMovieClick, activeUser }: ActivityProps) {
  const [filter, setFilter] = useState<'all' | 'friends'>('all');
  const [friends, setFriends] = useState<number[]>([]);

  useEffect(() => {
    if (activeUser) {
      fetchFriends(activeUser.id).then((users) => {
        setFriends(users.map(u => u.id));
      });
    }
  }, [activeUser]);

  const moviesById = new Map(movies.map((movie) => [movie.id, movie]));

  const reviewActivities: ActivityItem[] = reviews
    .map((review) => {
      const movie = moviesById.get(review.movieId);
      if (!movie) return null;
      const avatar =
        review.avatar ||
        `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(review.username)}`;
      return {
        id: review.id,
        type: 'review' as const,
        user: { id: review.userId, name: review.username, avatar }, // review.userId matches user.id
        movie,
        rating: review.averageRating,
        breakdown: review.breakdown,
        time: formatDate(review.date),
        liked: review.favorite,
      };
    })
    .filter(Boolean) as ActivityItem[];

  const activities = reviewActivities.filter(activity => {
    if (filter === 'friends') {
      if (!activeUser) return false;
      return friends.includes(activity.user.id);
    }
    return true;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star size={20} className="text-[#00c030]" />;
      case 'watched':
        return <Eye size={20} className="text-[#00c030]" />;
      case 'rating':
        return <Star size={20} className="text-[#00c030]" />;
      case 'list':
        return <List size={20} className="text-[#00c030]" />;
      default:
        return <Star size={20} className="text-[#00c030]" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'review':
        return 'a écrit une critique de';
      case 'watched':
        return 'a regardé';
      case 'rating':
        return 'a noté';
      case 'list':
        return 'a créé une liste';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">Activité</h1>
        <p className="text-gray-400">Flux généré automatiquement depuis le backend FastAPI</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 border-b border-[#2c3440]">
        <button
          onClick={() => setFilter('all')}
          className={`pb-4 transition-colors ${filter === 'all' ? 'text-white border-b-2 border-[#00c030]' : 'text-gray-400 hover:text-white'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('friends')}
          className={`pb-4 transition-colors ${filter === 'friends' ? 'text-white border-b-2 border-[#00c030]' : 'text-gray-400 hover:text-white'}`}
        >
          Amis
        </button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-[#1a1f29] rounded-lg p-6">
            <div className="flex gap-4">
              {/* Avatar */}
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-gray-300">
                      <span className="text-white">{activity.user.name}</span>{' '}
                      {getActivityText(activity)}
                      {activity.type !== 'list' && activity.movie && (
                        <>
                          {' '}
                          <button
                            onClick={() => onMovieClick(activity.movie!.id)}
                            className="text-[#00c030] hover:opacity-80 transition-opacity"
                          >
                            {activity.movie.title}
                          </button>
                        </>
                      )}
                      {activity.type === 'list' && activity.listName && (
                        <>
                          {' '}
                          <span className="text-[#00c030]">{activity.listName}</span>
                        </>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-gray-500 text-sm">{activity.time}</span>
                    </div>
                  </div>
                </div>

                {/* Movie Poster & Details */}
                {activity.type !== 'list' && activity.movie && (
                  <div className="flex gap-4 bg-[#14181c] rounded-lg p-4">
                    <img
                      src={activity.movie.poster}
                      alt={activity.movie.title}
                      className="w-20 h-30 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onMovieClick(activity.movie!.id)}
                    />

                    <div className="flex-1">
                      <h3
                        className="text-white hover:text-[#00c030] cursor-pointer transition-colors mb-1"
                        onClick={() => onMovieClick(activity.movie!.id)}
                      >
                        {activity.movie.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {activity.movie.year} · {activity.movie.director}
                      </p>

                      {activity.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-300 text-sm">Note moyenne</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < Math.round(activity.rating!)
                                    ? 'fill-[#00c030] text-[#00c030]'
                                    : 'text-gray-600'
                                }
                              />
                            ))}
                            <span className="text-gray-400 text-xs ml-2">
                              {activity.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}

                      {activity.breakdown && (
                        <p className="text-gray-400 text-sm">
                          Visuel {activity.breakdown.visual}/5 · Action {activity.breakdown.action}/5
                          · Scénario {activity.breakdown.scenario}/5
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {filter === 'friends' && !activeUser
              ? "Connectez-vous pour voir l'activité de vos amis."
              : filter === 'friends' && friends.length === 0
                ? "Vous n'avez pas encore d'amis. Les critiques de vos amis apparaîtront ici."
                : "Aucune activité disponible."}
          </div>
        )}
      </div>
    </div>
  );
}
