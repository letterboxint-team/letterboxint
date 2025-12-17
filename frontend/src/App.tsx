import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MovieDetail } from './components/MovieDetail';
import { UserProfile } from './components/UserProfile';
import { Lists } from './components/Lists';
import { Activity } from './components/Activity';
import {
  ApiUser,
  CreateReviewPayload,
  UiReview,
  createReview,
  fetchMovies,
  fetchReviews,
  fetchUsers,
  getReviewStatsByMovie,
  login,
  mapApiMoviesToUiMovies,
  mapApiReviewsToUiReviews,
  signup,
} from './api/backend';
import AuthBar from './components/AuthBar';
import { Movie } from './data/movies';

type Page = 'home' | 'movie' | 'profile' | 'lists' | 'activity';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<UiReview[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem('lb_token')
  );
  const [activeUserId, setActiveUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem('lb_user_id');
    return stored ? Number(stored) : null;
  });
  const activeUser = users.find((u) => u.id === activeUserId) || null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apiMovies, apiReviews, apiUsers] = await Promise.all([
          fetchMovies(),
          fetchReviews(),
          fetchUsers(),
        ]);
        const reviewStats = getReviewStatsByMovie(apiReviews);
        const uiMovies = mapApiMoviesToUiMovies(apiMovies, reviewStats);
        const uiReviews = mapApiReviewsToUiReviews(apiReviews, apiUsers, uiMovies);

        setMovies(uiMovies);
        setReviews(uiReviews);
        setUsers(apiUsers);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement du backend', err);
        setError("Impossible de joindre le backend pour le moment. Aucune donnée affichée.");
        setMovies([]);
        setReviews([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const navigateToMovie = (movieId: number) => {
    setSelectedMovieId(movieId);
    setCurrentPage('movie');
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const handleAuth = async (mode: 'login' | 'signup', username: string, password: string) => {
    try {
      setError(null);
      if (mode === 'signup') {
        const newUser = await signup(username, password);
        setUsers((prev) => [...prev, newUser]);
        setActiveUserId(newUser.id);
        localStorage.setItem('lb_user_id', String(newUser.id));
      }
      const loginResponse = await login(username, password);
      setAuthToken(loginResponse.access_token);
      localStorage.setItem('lb_token', loginResponse.access_token);

      // Refresh users to be sure we have the user we just created
      const refreshedUsers = await fetchUsers();
      setUsers(refreshedUsers);
      const matchedUser =
        refreshedUsers.find((u) => u.username === username) || refreshedUsers[0] || null;
      if (matchedUser) {
        setActiveUserId(matchedUser.id);
        localStorage.setItem('lb_user_id', String(matchedUser.id));
      }
    } catch (err) {
      console.error('Auth error', err);
      setError("Connexion/inscription impossible. Vérifiez vos identifiants ou le backend.");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setActiveUserId(null);
    localStorage.removeItem('lb_token');
    localStorage.removeItem('lb_user_id');
  };

  const handleCreateReview = async (payload: Omit<CreateReviewPayload, 'user_id'>) => {
    if (!activeUserId) {
      setError("Vous devez être connecté pour publier une critique.");
      return;
    }
    try {
      const apiReview = await createReview(
        { ...payload, user_id: activeUserId },
        authToken || undefined
      );
      const updatedReviews = await fetchReviews();
      const reviewStats = getReviewStatsByMovie(updatedReviews);
      const uiMovies = mapApiMoviesToUiMovies(await fetchMovies(), reviewStats);
      setMovies(uiMovies);
      setReviews(mapApiReviewsToUiReviews(updatedReviews, users, uiMovies));
      setError(null);
    } catch (err) {
      console.error('Erreur ajout critique', err);
      setError("Impossible d'ajouter la critique. Vérifiez le backend.");
    }
  };

  return (
    <div className="min-h-screen bg-[#14181c]">
      <Header currentPage={currentPage} onNavigate={navigateToPage} />
      <AuthBar
        activeUser={activeUser}
        onLogin={(u, p) => handleAuth('login', u, p)}
        onSignup={(u, p) => handleAuth('signup', u, p)}
        onLogout={handleLogout}
      />

      <main>
        {loading ? (
          <div className="text-white text-center py-16">Chargement des données...</div>
        ) : (
          <>
            {error && (
              <div className="bg-[#2c3440] text-yellow-200 px-4 py-3 text-center">
                {error}
              </div>
            )}
            {currentPage === 'home' && (
              <HomePage movies={movies} reviews={reviews} onMovieClick={navigateToMovie} />
            )}
            {currentPage === 'movie' && selectedMovieId && (
              <MovieDetail
                movieId={selectedMovieId}
                movies={movies}
                reviews={reviews}
                canReview={Boolean(activeUser)}
                onCreateReview={handleCreateReview}
                onMovieClick={navigateToMovie}
              />
            )}
            {currentPage === 'profile' && (
              <UserProfile
                movies={movies}
                reviews={reviews}
                activeUser={activeUser}
                onMovieClick={navigateToMovie}
              />
            )}
            {currentPage === 'lists' && (
              <Lists movies={movies} onMovieClick={navigateToMovie} />
            )}
            {currentPage === 'activity' && (
              <Activity
                movies={movies}
                reviews={reviews}
                onMovieClick={navigateToMovie}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
