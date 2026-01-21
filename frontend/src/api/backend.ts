import { Movie } from '../data/movies';

const API_BASE_URL = 'http://localhost:8000'.replace(/\/$/, '');
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export interface ApiUIMovie {
  id: number;
  title: string;
  director: string;
  release_year?: number | null;
  poster_path?: string | null;
  global_rating?: number | null;
}

export interface ApiMovieDetail {
  id: number;
  title: string;
  director: string;
  release_year?: number | null;
  genre: string;
  poster_path: string;
  synopsis?: string | null;
  runtime?: number | null;
  global_rating?: number | null;
}

export interface ApiUser {
  id: number;
  username: string;
  password_hash: string;
  created_at?: string | null;
  profile_picture?: string | null;
}

export interface ApiReview {
  id: number;
  user_id: number;
  movie_id: number;
  note_visual: number;
  note_action: number;
  note_scenario: number;
  date_reviewed: string;
  favorite: boolean;
  comment?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CreateReviewPayload {
  user_id: number;
  movie_id: number;
  note_visual: number;
  note_action: number;
  note_scenario: number;
  favorite?: boolean;
  comment?: string;
}

export interface ReviewStats {
  average: number;
  count: number;
  lastDate?: string;
}

export interface UiReview {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  movieId: number;
  movieTitle: string;
  moviePoster?: string;
  averageRating: number;
  breakdown: {
    visual: number;
    action: number;
    scenario: number;
  };
  date: string;
  favorite: boolean;
  comment?: string;
}

const defaultPoster =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="%2314181c"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234a5568" font-family="Arial" font-size="24">Poster</text></svg>';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Erreur API ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function postJson<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur API ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function patchJson<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur API ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}


export async function fetchMovies(): Promise<ApiUIMovie[]> {
  return fetchJson<ApiUIMovie[]>('/movies');
}

export async function fetchMovie(id: number): Promise<ApiMovieDetail> {
  return fetchJson<ApiMovieDetail>(`/movies/${id}`);
}

export async function fetchUsers(): Promise<ApiUser[]> {
  return fetchJson<ApiUser[]>('/users');
}

export async function fetchFriends(userId: number): Promise<ApiUser[]> {
  return fetchJson<ApiUser[]>(`/users/${userId}/friends`);
}

export async function addFriend(userId: number, friendId: number): Promise<void> {
  return postJson<void>('/friends', { user_id: userId, friend_id: friendId });
}

export async function fetchReviews(): Promise<ApiReview[]> {
  return fetchJson<ApiReview[]>('/reviews');
}


async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function signup(username: string, password: string): Promise<ApiUser> {
  const password_hash = await hashPassword(password);
  return postJson<ApiUser>('/signup', {
    username,
    password_hash,
  });
}

export async function updateUser(userId: number, payload: { username?: string }): Promise<ApiUser> {
  return patchJson<ApiUser>(`/users/${userId}`, payload);
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const password_hash = await hashPassword(password);
  return postJson<LoginResponse>('/login', {
    username,
    password_hash,
  });
}

export async function createReview(
  payload: CreateReviewPayload,
  token?: string
): Promise<ApiReview> {
  return postJson<ApiReview>('/reviews', payload);
}

export function reviewAverage(review: ApiReview): number {
  return (review.note_action + review.note_scenario + review.note_visual) / 3;
}

export function getReviewStatsByMovie(reviews: ApiReview[]): Record<number, ReviewStats> {
  const totals: Record<number, { total: number; count: number; lastDate?: string }> = {};

  reviews.forEach((review) => {
    const avg = reviewAverage(review);
    const entry = totals[review.movie_id] || { total: 0, count: 0, lastDate: review.date_reviewed };
    entry.total += avg;
    entry.count += 1;
    entry.lastDate =
      entry.lastDate && entry.lastDate > review.date_reviewed ? entry.lastDate : review.date_reviewed;
    totals[review.movie_id] = entry;
  });

  return Object.entries(totals).reduce((acc, [movieId, data]) => {
    acc[Number(movieId)] = {
      average: Number((data.total / data.count).toFixed(2)),
      count: data.count,
      lastDate: data.lastDate,
    };
    return acc;
  }, {} as Record<number, ReviewStats>);
}

export function parseGenres(rawGenre: string | string[] | undefined): string[] {
  if (!rawGenre) return [];
  if (Array.isArray(rawGenre)) return rawGenre.filter(Boolean);
  return rawGenre
    .split(',')
    .map((genre) => genre.trim())
    .filter(Boolean);
}

function posterForMovie(apiMovie: ApiUIMovie | ApiMovieDetail) {
  if (apiMovie.poster_path) {
    return apiMovie.poster_path.startsWith('http')
      ? apiMovie.poster_path
      : `${TMDB_IMG_BASE}${apiMovie.poster_path}`;
  }
  return defaultPoster;
}

export function mapApiMoviesToUiMovies(
  apiMovies: ApiUIMovie[],
  reviewStats: Record<number, ReviewStats>
): Movie[] {
  return apiMovies.map((apiMovie) => {
    const stats = reviewStats[apiMovie.id];

    return {
      id: apiMovie.id,
      title: apiMovie.title,
      year: apiMovie.release_year || 0,
      director: apiMovie.director,
      poster: posterForMovie(apiMovie),
      rating: apiMovie.global_rating ?? 0, // Use global_rating from backend
      userRating: undefined,
      watched: Boolean(stats?.count),
      genre: [], // Loaded in detail
      runtime: 0, // Loaded in detail,
      synopsis: '', // Loaded in detail
      cast: [],
      userReview: undefined,
    };
  });
}

export function mapApiReviewsToUiReviews(
  apiReviews: ApiReview[],
  users: ApiUser[],
  movies: Movie[]
): UiReview[] {
  const usersById = new Map<number, ApiUser>(users.map((user) => [user.id, user]));
  const moviesById = new Map<number, Movie>(movies.map((movie) => [movie.id, movie]));

  return apiReviews.map((review) => {
    const user = usersById.get(review.user_id);
    const movie = moviesById.get(review.movie_id);
    const average = Number(reviewAverage(review).toFixed(2));

    return {
      id: review.id,
      userId: review.user_id,
      username: user?.username || `Utilisateur #${review.user_id}`,
      avatar: user?.profile_picture || '',
      movieId: review.movie_id,
      movieTitle: movie?.title || `Film #${review.movie_id}`,
      moviePoster: movie?.poster,
      averageRating: average,
      breakdown: {
        visual: review.note_visual,
        action: review.note_action,
        scenario: review.note_scenario,
      },
      date: review.date_reviewed,
      favorite: review.favorite,
      comment: review.comment || undefined,
    };
  });
}
