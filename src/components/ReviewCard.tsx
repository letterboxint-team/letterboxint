import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { UiReview } from '../api/backend';

interface ReviewCardProps {
  review: UiReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review.favorite ? 1 : 0);
  const [isLiked, setIsLiked] = useState(review.favorite);
  const initials = review.username.slice(0, 2).toUpperCase();

  const handleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  };

  return (
    <div className="bg-[#1a1f29] rounded-lg p-6">
      <div className="flex items-start gap-4">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#00c030] text-white flex items-center justify-center">
            {initials}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white">{review.username}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(review.averageRating)
                          ? 'fill-[#00c030] text-[#00c030]'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{review.date}</span>
              </div>
              <p className="text-gray-400 text-sm">
                Visuel {review.breakdown.visual}/5 · Action {review.breakdown.action}/5 · Scénario{' '}
                {review.breakdown.scenario}/5
              </p>
              <p className="text-gray-500 text-xs mt-1">Note moyenne {review.averageRating}/5</p>
              {review.movieTitle && (
                <p className="text-gray-500 text-xs">Film : {review.movieTitle}</p>
              )}
            </div>

            {review.favorite && (
              <Heart size={16} className="text-[#ff6b6b] fill-[#ff6b6b]" />
            )}
          </div>

          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-gray-400 hover:text-[#ff6b6b] transition-colors"
          >
            <Heart size={16} className={isLiked ? 'fill-[#ff6b6b] text-[#ff6b6b]' : ''} />
            <span className="text-sm">{likes} J'aime</span>
          </button>
        </div>
      </div>
    </div>
  );
}
