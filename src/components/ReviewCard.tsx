import { Star, Heart } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  liked: boolean;
  likes: number;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-[#1a1f29] rounded-lg p-6">
      <div className="flex items-start gap-4">
        <img
          src={review.avatar}
          alt={review.user}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white">{review.user}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? 'fill-[#00c030] text-[#00c030]' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{review.date}</span>
              </div>
            </div>

            {review.liked && (
              <Heart size={16} className="text-[#ff6b6b] fill-[#ff6b6b]" />
            )}
          </div>

          <p className="text-gray-300 leading-relaxed mb-4">{review.text}</p>

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
