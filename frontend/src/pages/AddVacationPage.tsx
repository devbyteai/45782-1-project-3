import { useNavigate } from 'react-router-dom';
import VacationForm from '../components/admin/VacationForm';
import vacationsService from '../services/vacations';
import { CreateVacationDTO } from '../models/Vacation';
import './AddVacationPage.css';

function AddVacationPage() {
    const navigate = useNavigate();

    const handleSubmit = async (data: CreateVacationDTO) => {
        await vacationsService.create(data);
        navigate('/admin/vacations');
    };

    const handleCancel = () => {
        navigate('/admin/vacations');
    };

    return (
        <div className="add-vacation-page">
            <VacationForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default AddVacationPage;
