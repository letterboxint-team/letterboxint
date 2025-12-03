import { Film, User, List, Activity, Search } from 'lucide-react';

type Page = 'home' | 'movie' | 'profile' | 'lists' | 'activity';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
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
                className="bg-[#14181c] text-white text-sm px-4 py-2 pl-10 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#00c030]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
