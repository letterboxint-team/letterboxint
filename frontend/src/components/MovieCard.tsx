import { Star, Eye, Heart } from 'lucide-react';
import { Movie } from '../data/movies';
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
	movie: Movie;
	showStats?: boolean;
}

export function MovieCard({ movie, showStats = true }: MovieCardProps) {
	const navigate = useNavigate();

	return (
		<div onClick={() => navigate(`/movie/${movie.id}`)} className="group cursor-pointer movie-card">
			<div className="relative aspect-[2/3] rounded-md overflow-hidden mb-2 bg-[#1a1f29]">
				<img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
				{/* Rating badge */}
				{
					<div className="rating absolute top-2 right-2 bg-black/80 rounded px-2 py-1 flex items-center gap-1">
						{movie.rating > 0 ? (
							<>
								<Star size={12} className="text-[#00c030] fill-[#00c030]" />
								<span className="text-white text-xs">{movie.rating.toFixed(1)}</span>
							</>
						) : (
							<span className="text-white text-xs whitespace-nowrap">Not yet reviewed</span>
						)}
					</div>
				}
			</div>
			<div>
				{/* Movie title and release year */}
				<h3 className="text-white text-sm group-hover:text-[#00c030] transition-colors line-clamp-1">{movie.title}</h3>
				<p className="text-gray-400 text-xs">{movie.year}</p>
			</div>
		</div>
	);
}
