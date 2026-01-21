import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Search } from 'lucide-react';
import { ApiUser, addFriend, fetchFriends } from '../api/backend';

interface FriendsProps {
    activeUser: ApiUser | null;
    allUsers: ApiUser[];
}

export function Friends({ activeUser, allUsers }: FriendsProps) {
    const [friends, setFriends] = useState<ApiUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (activeUser) {
            loadFriends();
        } else {
            setFriends([]);
        }
    }, [activeUser]);

    const loadFriends = async () => {
        if (!activeUser) return;
        setLoading(true);
        try {
            const data = await fetchFriends(activeUser.id);
            setFriends(data);
        } catch (err) {
            console.error('Failed to load friends', err);
            setError("Impossible de charger vos amis.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (friendId: number) => {
        if (!activeUser) return;
        try {
            await addFriend(activeUser.id, friendId);
            // Reload friends list
            await loadFriends();
        } catch (err) {
            console.error('Failed to add friend', err);
            setError("Impossible d'ajouter cet ami.");
        }
    };

    const isFriend = (userId: number) => friends.some(f => f.id === userId);

    // Filter users for search: exclude self and already friends
    // Also filter by search query
    const filteredUsers = allUsers.filter(user => {
        if (!activeUser || user.id === activeUser.id) return false;
        if (isFriend(user.id)) return false;

        if (!searchQuery) return false; // Only show suggestions when searching? Or show all? 
        // Let's show all available users if query is empty, or maybe just top 10?
        // "allows to add new friend" - usually search.
        // Let's require at least 1 char for search to avoid listing everyone if there are many users.
        // Or just list everyone if local. Let's list everyone for now if query is empty, or search matches.

        return user.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (!activeUser) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-300">
                Connectez-vous pour voir et ajouter des amis.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl text-white font-bold mb-8">Mes Amis</h1>

            {error && (
                <div className="bg-red-900/50 text-red-200 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* My Friends List */}
                <div className="bg-[#1a1f29] rounded-xl p-6 border border-[#2c3440]">
                    <h2 className="text-xl text-[#00c030] font-semibold mb-4 flex items-center gap-2">
                        <UserCheck size={20} />
                        Amis ({friends.length})
                    </h2>

                    {loading ? (
                        <div className="text-gray-300">Chargement...</div>
                    ) : friends.length === 0 ? (
                        <div className="text-gray-400 italic">Vous n'avez pas encore d'amis.</div>
                    ) : (
                        <ul className="space-y-3">
                            {friends.map(friend => (
                                <li key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2c3440] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                        {friend.profile_picture ? (
                                            <img src={friend.profile_picture} alt={friend.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                {friend.username.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-white font-medium">{friend.username}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Add Friends */}
                <div className="bg-[#1a1f29] rounded-xl p-6 border border-[#2c3440]">
                    <h2 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
                        <UserPlus size={20} />
                        Ajouter des amis
                    </h2>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#14181c] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-[#2c3440] focus:border-[#40bcf4] focus:outline-none focus:ring-1 focus:ring-[#40bcf4]"
                        />
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="text-gray-400 italic text-center py-4">
                                {searchQuery ? "Aucun utilisateur trouvé." : "Recherchez des amis à ajouter."}
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-[#14181c] border border-[#2c3440]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                            {user.profile_picture ? (
                                                <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-gray-200">{user.username}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAddFriend(user.id)}
                                        className="px-3 py-1 bg-[#40bcf4] hover:bg-[#3daae0] text-[#14181c] text-sm font-bold rounded transition-colors"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
