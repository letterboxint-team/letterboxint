import { Film, User, List, Activity, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Page = 'home' | 'movie' | 'profile' | 'lists' | 'activity';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onSelectMovie?: (movieId: number) => void;
}

export function Header({ onNavigate, onSelectMovie }: HeaderProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ id: number; title: string; poster_path?: string | null; release_date?: string | null }>>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  const performSearch = async () => {
    const title = query.trim();
    if (!title) return;
    try {
      const res = await fetch(`${API_BASE_URL}/movies/search/?title=${encodeURIComponent(title)}`);
      if (!res.ok) return;
      const results: Array<{ id: number } & Record<string, unknown>> = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        const firstId = results[0].id;
        if (typeof firstId === 'number') {
          onSelectMovie?.(firstId);
        }
      }
    } catch (e) {
      console.error('Search error', e);
    }
  };

  // Debounced live search for dropdown
  useEffect(() => {
    const controller = new AbortController();
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/movies/search/?title=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const results: Array<{ id: number; title: string; poster_path?: string | null; release_date?: string | null }> = await res.json();
        const top5 = (results || []).slice(0, 5);
        setSuggestions(top5);
        setOpen(top5.length > 0);
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') {
          console.error('Suggest error', e);
        }
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query, API_BASE_URL]);

  const selectSuggestion = (movieId: number, title?: string) => {
    if (title) setQuery(title);
    setOpen(false);
    setSuggestions([]);
    onSelectMovie?.(movieId);
  };

  const posterUrl = (path?: string | null) =>
    path ? `https://image.tmdb.org/t/p/w92${path}` : undefined;


  // get current page from URL
  const currentPage = window.location.pathname.split('/')[1];

  return (
    <header className="bg-[#1a1f29] border-b border-[#2c3440] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Film className="text-[#00c030]" size={28} />
              <span className="text-white text-xl">Letterbox'INT</span>
            </button>
            
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('home')}
                className={`text-sm transition-colors ${
                  currentPage === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Films
              </button>
              <button
                onClick={() => onNavigate('lists')}
                className={`text-sm transition-colors ${
                  currentPage === 'lists' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Listes
              </button>
              <button
                onClick={() => onNavigate('activity')}
                className={`text-sm transition-colors ${
                  currentPage === 'activity' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Activité
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={query}
                ref={inputRef}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') performSearch();
                }}
                onFocus={() => setOpen(suggestions.length > 0)}
                onBlur={() => {
                  // delay closing to allow click on suggestion
                  setTimeout(() => setOpen(false), 120);
                }}
                className="bg-[#14181c] text-white text-sm px-4 py-2 pl-10 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#00c030]"
              />
              <button
                aria-label="Rechercher"
                onClick={performSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={16} />
              </button>

              {open && (
                <div className="absolute mt-2 w-72 left-0 bg-[#1a1f29] border border-[#2c3440] rounded-md shadow-lg overflow-hidden z-50">
                  {loading && (
                    <div className="px-3 py-2 text-sm text-gray-400">Recherche…</div>
                  )}
                  {!loading && suggestions.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">Aucun résultat</div>
                  )}
                  {!loading && suggestions.length > 0 && (
                    <ul className="max-h-96 overflow-auto">
                      {suggestions.map((s) => {
                        const year = s.release_date ? s.release_date.slice(0, 4) : '';
                        const img = posterUrl(s.poster_path || undefined);
                        return (
                          <li
                            key={s.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-[#2c3440] cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(s.id, s.title);
                            }}
                          >
                            {img ? (
                              <img src={img} alt="poster" className="w-8 h-12 object-cover rounded-sm" />
                            ) : (
                              <div className="w-8 h-12 bg-[#14181c] rounded-sm" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate">{s.title}</div>
                              {year && (
                                <div className="text-xs text-gray-400">{year}</div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 bg-[#00c030] rounded-full flex items-center justify-center hover:bg-[#00d436] transition-colors"
            >
              <User size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
