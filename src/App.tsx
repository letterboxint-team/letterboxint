import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MovieDetail } from './components/MovieDetail';
import { UserProfile } from './components/UserProfile';
import { Lists } from './components/Lists';
import { Activity } from './components/Activity';

type Page = 'home' | 'movie' | 'profile' | 'lists' | 'activity';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const navigateToMovie = (movieId: number) => {
    setSelectedMovieId(movieId);
    setCurrentPage('movie');
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#14181c]">
      <Header currentPage={currentPage} onNavigate={navigateToPage} />
      
      <main>
        {currentPage === 'home' && (
          <HomePage onMovieClick={navigateToMovie} />
        )}
        {currentPage === 'movie' && selectedMovieId && (
          <MovieDetail movieId={selectedMovieId} onMovieClick={navigateToMovie} />
        )}
        {currentPage === 'profile' && (
          <UserProfile onMovieClick={navigateToMovie} />
        )}
        {currentPage === 'lists' && (
          <Lists onMovieClick={navigateToMovie} />
        )}
        {currentPage === 'activity' && (
          <Activity onMovieClick={navigateToMovie} />
        )}
      </main>
    </div>
  );
}
