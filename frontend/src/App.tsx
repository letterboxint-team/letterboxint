import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MovieDetail } from './components/MovieDetail';
import { UserProfile } from './components/UserProfile';
import { Lists } from './components/Lists';
import { Activity } from './components/Activity';
import { Friends } from './components/Friends';
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
  fetchWatchedMovies,
  fetchFavoriteMovies,
  markAsWatched,
  unmarkAsWatched,
  markAsFavorite,
  unmarkAsFavorite,
} from './api/backend';
import AuthBar from './components/AuthBar';
import { Movie } from './data/movies';
import { Routes, Route, useNavigate } from "react-router-dom";


// Helper for cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// type Page = 'home' | 'movie' | 'profile' | 'lists' | 'activity';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<UiReview[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User specific data
  const [activeUser, setActiveUser] = useState<ApiUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<Set<number>>(new Set());
  const [favoriteMovies, setFavoriteMovies] = useState<Set<number>>(new Set());

  // Fetch user specific data
  const fetchUserData = async (userId: number) => {
    try {
      const [watched, favorites] = await Promise.all([
        fetchWatchedMovies(userId),
        fetchFavoriteMovies(userId)
      ]);
      setWatchedMovies(new Set(watched.map(w => w.movie_id)));
      setFavoriteMovies(new Set(favorites.map(f => f.movie_id)));
    } catch (e) {
      console.error("Failed to fetch user data", e);
    }
  };

  useEffect(() => {
    // Initial data load
    Promise.all([fetchMovies(), fetchReviews(), fetchUsers()])
      .then(([apiMovies, apiReviews, apiUsers]) => {
        const reviewStats = getReviewStatsByMovie(apiReviews);
        // We initially map without knowing watched status (or empty)
        // logic downstream in mapApiMoviesToUiMovies will use reviewed stats for "watched"
        // We will override this later or update mapApiMoviesToUiMovies
        setMovies(mapApiMoviesToUiMovies(apiMovies, reviewStats));
        setReviews(mapApiReviewsToUiReviews(apiReviews, apiUsers, mapApiMoviesToUiMovies(apiMovies, reviewStats)));
        setUsers(apiUsers);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les données. Vérifiez que le backend FastAPI est lancé.');
      })
      .finally(() => setLoading(false));

    // Restore session
    const token = getCookie('access_token');
    const storedUser = localStorage.getItem('letterboxint_user');
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthToken(token);
        setActiveUser(user);
        fetchUserData(user.id);
      } catch (e) {
        console.error("Failed to parse stored user data", e);
        // Clear invalid stored data
        localStorage.removeItem('letterboxint_user');
        // document.cookie = 'access_token=; Max-Age=0; path=/'; // Clear cookie if needed
      }
    }
  }, []);

  // const navigateToMovie = (movieId: number) => {
  //   setSelectedMovieId(movieId);
  //   setCurrentPage('movie');
  // };

  // const navigateToPage = (page: Page) => {
  //   setCurrentPage(page);
  // };

  // const handleSearchSelect = async (movieId: number) => {
  //   try {
  //     const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
  //     // Ensure the movie exists in backend DB (read_movie will add if missing)
  //     await fetch(`${API_BASE_URL}/movies/${movieId}`);
  //     // Refresh movies so MovieDetail can find it
  //     const apiMovies = await fetchMovies();
  //     const apiReviews = await fetchReviews();
  //     const reviewStats = getReviewStatsByMovie(apiReviews);
  //     const uiMovies = mapApiMoviesToUiMovies(apiMovies, reviewStats);
  //     setMovies(uiMovies);
  //     navigateToMovie(movieId);
  //   } catch (err) {
  //     console.error('Search select error', err);
  //     setError("Impossible d'afficher le film recherché.");
  //   }
  // };

  const handleAuth = async (mode: 'login' | 'signup', username: string, password: string) => {
    try {
      setError(null);
      if (mode === 'signup') {
        const newUser = await signup(username, password);
        setUsers((prev) => [...prev, newUser]);
      }
      const loginResponse = await login(username, password);
      setAuthToken(loginResponse.access_token);
      document.cookie = `access_token=${loginResponse.access_token}; path=/; max-age=86400`;

      // Refresh users to be sure we have the user we just created
      const refreshedUsers = await fetchUsers();
      setUsers(refreshedUsers);
      const matchedUser =
        refreshedUsers.find((u) => u.username === username) || refreshedUsers[0] || null;
      if (matchedUser) {
        setActiveUser(matchedUser);
        localStorage.setItem('letterboxint_user', JSON.stringify(matchedUser));

        setAuthBarVisible(false); // Hide auth bar on success
        // Fetch user data
        fetchUserData(matchedUser.id);
      }
    } catch (err: any) {
      console.error('Auth error', err);
      setError("Connexion/inscription impossible. Vérifiez vos identifiants ou le backend.");
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setAuthToken(null);
    setWatchedMovies(new Set());
    setFavoriteMovies(new Set());
    document.cookie = 'access_token=; Max-Age=0; path=/;';
    localStorage.removeItem('letterboxint_user');
  };

  const handleCreateReview = async (payload: Omit<CreateReviewPayload, 'user_id'>) => {
    if (!activeUser) {
      setError("Vous devez être connecté pour publier une critique.");
      return;
    }
    try {
      await createReview(
        {
          ...payload,
          user_id: activeUser.id,
        },
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

  const navigate = useNavigate();
  const [isAuthBarVisible, setAuthBarVisible] = useState(false);

  // Login handler needs to ensure bar stays visible or logic handles it (activeUser becomes true)
  // Actually if activeUser is set, clean up isAuthBarVisible? 
  // Let's keep it simple.

  return (
    <div className="min-h-screen bg-[#14181c]">
      <Header
        onNavigate={(path) => navigate(`/${path}`)}
        onSelectMovie={(id) => navigate(`/movie/${id}`)}
        isLoggedIn={Boolean(activeUser)}
        onRequestLogin={() => {
          if (!isAuthBarVisible) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          setAuthBarVisible((prev) => !prev);
        }}
      />

      {(activeUser || isAuthBarVisible) && (
        <AuthBar
          activeUser={activeUser}
          onLogin={(u, p) => handleAuth('login', u, p)}
          onSignup={(u, p) => handleAuth('signup', u, p)}
          onLogout={handleLogout}
        />
      )}

      <main>
        {loading ? (
          <div className="text-white text-center py-16">
            Chargement des données...
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-[#2c3440] text-white px-4 py-3 text-center">
                {error}
              </div>
            )}

            <Routes>
              <Route
                path="/home"
                element={
                  <HomePage
                    movies={movies}
                    reviews={reviews}
                    onMovieClick={(id) => navigate(`/movie/${id}`)}
                    onRefresh={async () => {
                      const [apiMovies, apiReviews] = await Promise.all([fetchMovies(), fetchReviews()]);
                      const reviewStats = getReviewStatsByMovie(apiReviews);
                      setMovies(mapApiMoviesToUiMovies(apiMovies, reviewStats));
                      // No need to set reviews/users here heavily if not needed, but consistency is good
                      // For homepage specifically, we want new movies.
                    }}
                  />
                }
              />

              <Route
                path="/movie/:movieId"
                element={
                  <MovieDetail
                    movies={movies}
                    reviews={reviews}
                    canReview={Boolean(activeUser)}
                    onCreateReview={async (payload) => {
                      await handleCreateReview(payload);
                      // Refresh user data because review might trigger auto-watch/favorite
                      if (activeUser) fetchUserData(activeUser.id);
                    }}
                    onMovieClick={(id) => navigate(`/movie/${id}`)}
                    onRequestLogin={() => {
                      setAuthBarVisible(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    watchedMovies={watchedMovies}
                    favoriteMovies={favoriteMovies}
                    onToggleWatched={async (movieId) => {
                      if (!activeUser) return;
                      if (watchedMovies.has(movieId)) {
                        await unmarkAsWatched(activeUser.id, movieId);
                        setWatchedMovies(prev => {
                          const next = new Set(prev);
                          next.delete(movieId);
                          return next;
                        });
                      } else {
                        await markAsWatched(activeUser.id, movieId);
                        setWatchedMovies(prev => new Set(prev).add(movieId));
                      }
                    }}
                    onToggleFavorite={async (movieId) => {
                      if (!activeUser) return;
                      if (favoriteMovies.has(movieId)) {
                        await unmarkAsFavorite(activeUser.id, movieId);
                        setFavoriteMovies(prev => {
                          const next = new Set(prev);
                          next.delete(movieId);
                          return next;
                        });
                      } else {
                        await markAsFavorite(activeUser.id, movieId);
                        setFavoriteMovies(prev => new Set(prev).add(movieId));
                      }
                    }}
                  />
                }
              />

              <Route
                path="/profile"
                element={
                  <UserProfile
                    movies={movies}
                    reviews={reviews}
                    activeUser={activeUser}
                    onMovieClick={(id) => navigate(`/movie/${id}`)}
                  />
                }
              />

              <Route
                path="/lists"
                element={
                  <Lists
                    movies={movies}
                    onMovieClick={(id) => navigate(`/movie/${id}`)}
                  />
                }
              />

              <Route
                path="/activity"
                element={
                  <Activity
                    movies={movies}
                    reviews={reviews}
                    onMovieClick={(id) => navigate(`/movie/${id}`)}
                    activeUser={activeUser}
                  />
                }
              />

              <Route
                path="/friends"
                element={
                  <Friends
                    activeUser={activeUser}
                    allUsers={users}
                  />
                }
              />
            </Routes>
          </>
        )}
      </main>
    </div>
  );
}
