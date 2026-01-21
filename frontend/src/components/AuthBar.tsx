import { useState } from 'react';
import { ApiUser } from '../api/backend';

interface AuthBarProps {
  activeUser: ApiUser | null;
  onLogin: (username: string, password: string) => void;
  onSignup: (username: string, password: string) => void;
  onLogout: () => void;
}

export default function AuthBar({ activeUser, onLogin, onSignup, onLogout }: AuthBarProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const disabled = !username || !password;

  return (
    <div className="bg-[#0f1217] border-b border-[#1f252f]">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
        {activeUser ? (
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-full bg-[#00c030] text-white flex items-center justify-center text-sm">
              {activeUser.username.slice(0, 2).toUpperCase()}
            </div>
            <span>Connecté en tant que {activeUser.username}</span>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm bg-[#1a1f29] text-white rounded-md hover:bg-[#253042] transition-colors border border-[#2c3440]"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
            <div className="flex items-center gap-2">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                className="bg-[#1a1f29] text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00c030]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="bg-[#1a1f29] text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00c030]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLogin(username, password)}
                disabled={disabled}
                className={`px-4 py-2 rounded-md text-sm ${disabled
                  ? 'bg-[#2c3440] text-gray-500 cursor-not-allowed'
                  : 'bg-[#00c030] text-white hover:bg-[#00d436]'
                  } transition-colors`}
              >
                Se connecter
              </button>
              <button
                onClick={() => onSignup(username, password)}
                disabled={disabled}
                className={`px-4 py-2 rounded-md text-sm border ${disabled
                  ? 'border-[#2c3440] text-gray-500 cursor-not-allowed'
                  : 'border-[#00c030] text-[#00c030] hover:bg-[#0f1217]'
                  } transition-colors`}
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
