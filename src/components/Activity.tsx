import { Star, Heart, Eye, List, Clock } from 'lucide-react';
import { movies } from '../data/movies';

interface ActivityProps {
  onMovieClick: (movieId: number) => void;
}

export function Activity({ onMovieClick }: ActivityProps) {
  const activities = [
    {
      id: 1,
      type: 'review' as const,
      user: {
        name: 'Marie Dubois',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      movie: movies[2],
      rating: 5,
      review: 'Un film parfait qui mélange les genres avec brio. Critique sociale percutante.',
      time: 'Il y a 2 heures',
      liked: true,
    },
    {
      id: 2,
      type: 'watched' as const,
      user: {
        name: 'Thomas Laurent',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      movie: movies[1],
      time: 'Il y a 3 heures',
    },
    {
      id: 3,
      type: 'rating' as const,
      user: {
        name: 'Sophie Martin',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      },
      movie: movies[0],
      rating: 4.5,
      time: 'Il y a 5 heures',
    },
    {
      id: 4,
      type: 'list' as const,
      user: {
        name: 'Alexandre Petit',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      },
      listName: 'Mes films d\'horreur préférés',
      movieCount: 15,
      time: 'Il y a 6 heures',
    },
    {
      id: 5,
      type: 'review' as const,
      user: {
        name: 'Julie Bernard',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      },
      movie: movies[4],
      rating: 4,
      review: 'Une expérience cinématographique intense. Le film d\'action ultime.',
      time: 'Il y a 8 heures',
      liked: false,
    },
    {
      id: 6,
      type: 'watched' as const,
      user: {
        name: 'Pierre Rousseau',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      },
      movie: movies[6],
      time: 'Il y a 10 heures',
    },
  ];

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

  const getActivityText = (activity: any) => {
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
        <p className="text-gray-400">Découvrez ce que font vos amis et la communauté</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 border-b border-[#2c3440]">
        <button className="pb-4 text-white border-b-2 border-[#00c030]">
          Tous
        </button>
        <button className="pb-4 text-gray-400 hover:text-white transition-colors">
          Amis
        </button>
        <button className="pb-4 text-gray-400 hover:text-white transition-colors">
          Populaires
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
                            onClick={() => onMovieClick(activity.movie.id)}
                            className="text-[#00c030] hover:opacity-80 transition-opacity"
                          >
                            {activity.movie.title}
                          </button>
                        </>
                      )}
                      {activity.type === 'list' && (
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
                      onClick={() => onMovieClick(activity.movie.id)}
                    />
                    
                    <div className="flex-1">
                      <h3
                        className="text-white hover:text-[#00c030] cursor-pointer transition-colors mb-1"
                        onClick={() => onMovieClick(activity.movie.id)}
                      >
                        {activity.movie.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {activity.movie.year} · {activity.movie.director}
                      </p>

                      {activity.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(activity.rating)
                                  ? 'fill-[#00c030] text-[#00c030]'
                                  : 'text-gray-600'
                              }
                            />
                          ))}
                        </div>
                      )}

                      {activity.review && (
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {activity.review}
                        </p>
                      )}
                    </div>

                    {activity.liked !== undefined && (
                      <div className="flex-shrink-0">
                        <Heart
                          size={20}
                          className={activity.liked ? 'text-[#ff6b6b] fill-[#ff6b6b]' : 'text-gray-600'}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* List Details */}
                {activity.type === 'list' && (
                  <div className="bg-[#14181c] rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <List size={18} className="text-[#00c030]" />
                      <span className="text-white">{activity.listName}</span>
                      <span className="text-gray-400 text-sm">· {activity.movieCount} films</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-[#1a1f29] text-white rounded-md hover:bg-[#2c3440] transition-colors">
          Charger plus d'activités
        </button>
      </div>
    </div>
  );
}
