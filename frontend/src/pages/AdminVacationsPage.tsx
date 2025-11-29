import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vacation } from '../models/Vacation';
import vacationsService from '../services/vacations';
import VacationCard from '../components/vacations/VacationCard';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';

function AdminVacationsPage() {
    const navigate = useNavigate();
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Vacation | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadVacations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vacationsService.getAll({ limit: 100 });
            setVacations(response.vacations);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load vacations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVacations();
    }, [loadVacations]);

    const handleEdit = (id: number) => {
        navigate(`/admin/vacations/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        const vacation = vacations.find(v => v.id === id);
        if (vacation) {
            setDeleteTarget(vacation);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            await vacationsService.delete(deleteTarget.id);
            setVacations(prev => prev.filter(v => v.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete vacation');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Vacations</h1>
                        <p className="text-gray-600 mt-1">{vacations.length} vacations in your catalog</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/vacations/add')}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Vacation
                    </button>
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
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">🏖️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No vacations yet</h3>
                        <p className="text-gray-500 mb-6">Add your first vacation to get started!</p>
                        <button
                            onClick={() => navigate('/admin/vacations/add')}
                            className="btn btn-primary"
                        >
                            Add Your First Vacation
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vacations.map(vacation => (
                            <VacationCard
                                key={vacation.id}
                                vacation={vacation}
                                isAdmin={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {deleteTarget && (
                    <DeleteConfirmDialog
                        title="Delete Vacation"
                        message={`Are you sure you want to delete the vacation to "${deleteTarget.destination}"? This action cannot be undone.`}
                        onConfirm={confirmDelete}
                        onCancel={() => setDeleteTarget(null)}
                        loading={deleting}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminVacationsPage;
