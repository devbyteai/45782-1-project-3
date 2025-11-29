import { useState, useEffect } from 'react';
import reportsService from '../services/reports';
import LikesChart from '../components/reports/LikesChart';
import CSVExport from '../components/reports/CSVExport';
import { VacationStats } from '../models/Vacation';

function ReportsPage() {
    const [stats, setStats] = useState<VacationStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const data = await reportsService.getStats();
                setStats(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load report data');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const totalLikes = stats.reduce((sum, stat) => sum + stat.likesCount, 0);
    const topDestination = stats.length > 0 ? stats.reduce((a, b) => a.likesCount > b.likesCount ? a : b) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-600 mt-1">Track vacation popularity and engagement</p>
                    </div>
                    <CSVExport />
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
                            <p className="text-gray-500">Loading report data...</p>
                        </div>
                    </div>
                ) : stats.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No data available</h3>
                        <p className="text-gray-500">Statistics will appear once vacations receive likes</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Destinations</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Likes</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Most Popular</p>
                                        <p className="text-lg font-bold text-gray-900 truncate">{topDestination?.destination || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Likes per Vacation</h2>
                            <LikesChart data={stats} />
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">Detailed Statistics</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {stats.map((stat, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">{stat.destination}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="inline-flex items-center gap-1 text-sm text-gray-900">
                                                        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                        {stat.likesCount}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                                style={{ width: `${totalLikes > 0 ? (stat.likesCount / totalLikes) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 w-10 text-right">
                                                            {totalLikes > 0 ? Math.round((stat.likesCount / totalLikes) * 100) : 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ReportsPage;
