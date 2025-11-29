import { Vacation } from '../../models/Vacation';
import vacationsService from '../../services/vacations';

interface VacationCardProps {
    vacation: Vacation;
    isAdmin?: boolean;
    onLike?: (id: number) => void;
    onUnlike?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

function VacationCard({ vacation, isAdmin, onLike, onUnlike, onEdit, onDelete }: VacationCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleLikeClick = () => {
        if (vacation.isLiked) {
            onUnlike?.(vacation.id);
        } else {
            onLike?.(vacation.id);
        }
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={vacationsService.getImageUrl(vacation.image_filename)}
                    alt={vacation.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x250/3b82f6/ffffff?text=${encodeURIComponent(vacation.destination.split(',')[0])}`;
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-900 shadow-lg">
                        {formatPrice(vacation.price)}
                    </span>
                </div>

                {/* Like Button (for non-admin) */}
                {!isAdmin && (
                    <button
                        onClick={handleLikeClick}
                        className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            vacation.isLiked
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5" fill={vacation.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                )}

                {/* Destination on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{vacation.destination}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(vacation.start_date)} - {formatDate(vacation.end_date)}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {vacation.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    {/* Likes Count */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-semibold text-gray-700">{vacation.likes_count || 0}</span>
                            <span className="text-sm">likes</span>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit?.(vacation.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onDelete?.(vacation.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Like Button Text (for non-admin) */}
                    {!isAdmin && (
                        <button
                            onClick={handleLikeClick}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                vacation.isLiked
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {vacation.isLiked ? 'Liked' : 'Like'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VacationCard;
