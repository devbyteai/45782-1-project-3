import { useState, useEffect, useCallback } from 'react';
import { Vacation, VacationFilters as FilterType, LikeUpdateEvent } from '../models/Vacation';
import vacationsService from '../services/vacations';
import socketService from '../services/socket';
import VacationCard from '../components/vacations/VacationCard';
import VacationFilters from '../components/vacations/VacationFilters';
import Pagination from '../components/vacations/Pagination';

function VacationsPage() {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [filters, setFilters] = useState<FilterType>({ page: 1, limit: 9 });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVacations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vacationsService.getAll(filters);
            setVacations(response.vacations);
            setPagination({
                page: response.pagination.page,
                totalPages: response.pagination.totalPages,
                totalCount: response.pagination.totalCount
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load vacations');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadVacations();
    }, [loadVacations]);

    useEffect(() => {
        socketService.connect();
        const unsubscribe = socketService.onLikeUpdate((data: LikeUpdateEvent) => {
            setVacations(prev =>
                prev.map(v =>
                    v.id === data.vacationId
                        ? { ...v, likes_count: data.likesCount }
                        : v
                )
            );
        });
        return () => unsubscribe();
    }, []);

    const handleLike = async (id: number) => {
        try {
            const result = await vacationsService.like(id);
            setVacations(prev =>
                prev.map(v =>
                    v.id === id
                        ? { ...v, isLiked: true, likes_count: result.likesCount }
                        : v
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to like vacation');
        }
    };

    const handleUnlike = async (id: number) => {
        try {
            const result = await vacationsService.unlike(id);
            setVacations(prev =>
                prev.map(v =>
                    v.id === id
                        ? { ...v, isLiked: false, likes_count: result.likesCount }
                        : v
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to unlike vacation');
        }
    };

    const handleFilterChange = (newFilters: FilterType) => {
        setFilters(newFilters);
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Discover Vacations
                    </h1>
                    <p className="text-gray-600">
                        Find your next adventure from {pagination.totalCount} amazing destinations
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <VacationFilters filters={filters} onChange={handleFilterChange} />
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500">Loading vacations...</p>
                        </div>
                    </div>
                ) : vacations.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏖️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No vacations found</h3>
                        <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        {/* Vacation Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {vacations.map(vacation => (
                                <VacationCard
                                    key={vacation.id}
                                    vacation={vacation}
                                    onLike={handleLike}
                                    onUnlike={handleUnlike}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default VacationsPage;
