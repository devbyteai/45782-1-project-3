import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VacationForm from '../components/admin/VacationForm';
import vacationsService from '../services/vacations';
import { Vacation, UpdateVacationDTO } from '../models/Vacation';
import './EditVacationPage.css';

function EditVacationPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [vacation, setVacation] = useState<Vacation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadVacation = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await vacationsService.getById(parseInt(id));
                setVacation(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load vacation');
            } finally {
                setLoading(false);
            }
        };

        loadVacation();
    }, [id]);

    const handleSubmit = async (data: UpdateVacationDTO) => {
        if (!id) return;
        await vacationsService.update(parseInt(id), data);
        navigate('/admin/vacations');
    };

    const handleCancel = () => {
        navigate('/admin/vacations');
    };

    if (loading) {
        return <div className="edit-vacation-page loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="edit-vacation-page">
                <div className="error-message">{error}</div>
                <button onClick={() => navigate('/admin/vacations')}>Back to Vacations</button>
            </div>
        );
    }

    if (!vacation) {
        return (
            <div className="edit-vacation-page">
                <div className="error-message">Vacation not found</div>
                <button onClick={() => navigate('/admin/vacations')}>Back to Vacations</button>
            </div>
        );
    }

    return (
        <div className="edit-vacation-page">
            <VacationForm
                vacation={vacation}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isEdit={true}
            />
        </div>
    );
}

export default EditVacationPage;
