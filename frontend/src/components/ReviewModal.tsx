import { useState } from 'react';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: {
        note_visual: number;
        note_action: number;
        note_scenario: number;
        comment: string;
        favorite: boolean;
    }) => Promise<void>;
    movieTitle: string;
}

export function ReviewModal({ isOpen, onClose, onSubmit, movieTitle }: ReviewModalProps) {
    const [form, setForm] = useState({
        note_visual: 0,
        note_action: 0,
        note_scenario: 0,
        comment: '',
        favorite: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [hoveredStar, setHoveredStar] = useState<{ field: string, value: number } | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onSubmit(form);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (field: 'note_visual' | 'note_action' | 'note_scenario', label: string) => (
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">{label}</label>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar({ field, value: star })}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => setForm(prev => ({ ...prev, [field]: star }))}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            size={24}
                            className={
                                star <= (hoveredStar?.field === field ? hoveredStar.value : form[field])
                                    ? 'text-[#00c030] fill-[#00c030]'
                                    : 'text-gray-600'
                            }
                        />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1f29] rounded-xl w-full max-w-lg shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl text-white font-semibold">
                        Critiquer <span className="text-[#00c030]">{movieTitle}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {renderStars('note_visual', 'Visuel')}
                        {renderStars('note_action', 'Action')}
                        {renderStars('note_scenario', 'Scénario')}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm mb-2">
                            Votre avis (optionnel)
                        </label>
                        <textarea
                            value={form.comment}
                            onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Qu'avez-vous pensé du film ?"
                            className="w-full bg-[#14181c] text-white rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#00c030] resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.favorite}
                                onChange={(e) => setForm(prev => ({ ...prev, favorite: e.target.checked }))}
                                className="accent-[#00c030] w-4 h-4"
                            />
                            Coup de coeur
                        </label>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2 bg-[#00c030] text-white rounded-lg hover:bg-[#00d436] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {submitting ? 'Envoi...' : 'Publier'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
