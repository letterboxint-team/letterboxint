export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  poster: string;
  rating: number;
  userRating?: number;
  watched?: boolean;
  genre: string[];
  runtime: number;
  synopsis: string;
  cast: string[];
  userReview?: {
    rating: number;
    text: string;
    date: string;
    liked: boolean;
  };
}

export const getUserWatchedMovies = () => movies.filter(m => m.watched);
export const getUserRatedMovies = () => movies.filter(m => m.userRating);
export const getUserReviewedMovies = () => movies.filter(m => m.userReview);
