import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateVacationDTO, Vacation } from '../../models/Vacation';
import vacationsService from '../../services/vacations';

interface VacationFormProps {
    vacation?: Vacation;
    onSubmit: (data: CreateVacationDTO) => Promise<void>;
    onCancel: () => void;
    isEdit?: boolean;
}

function VacationForm({ vacation, onSubmit, onCancel, isEdit = false }: VacationFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateVacationDTO>({
        defaultValues: vacation ? {
            destination: vacation.destination,
            description: vacation.description,
            start_date: vacation.start_date,
            end_date: vacation.end_date,
            price: vacation.price
        } : undefined
    });

    const startDate = watch('start_date');

    useEffect(() => {
        if (vacation?.image_filename) {
            setImagePreview(vacationsService.getImageUrl(vacation.image_filename));
        }
    }, [vacation]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onFormSubmit = async (data: CreateVacationDTO) => {
        try {
            setLoading(true);
            setError(null);

            if (selectedFile) {
                data.image = selectedFile;
            }

            await onSubmit(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save vacation');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {isEdit ? 'Edit Vacation' : 'Add New Vacation'}
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Destination *
                            </label>
                            <input
                                type="text"
                                id="destination"
                                {...register('destination', {
                                    required: 'Destination is required',
                                    minLength: { value: 2, message: 'Destination must be at least 2 characters' }
                                })}
                                className={`input ${errors.destination ? 'input-error' : ''}`}
                                placeholder="Paris, France"
                            />
                            {errors.destination && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.destination.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                                })}
                                className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                                placeholder="Describe the vacation experience..."
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    min={isEdit ? undefined : today}
                                    {...register('start_date', {
                                        required: 'Start date is required',
                                        validate: (value) => {
                                            if (!isEdit && value < today) {
                                                return 'Start date cannot be in the past';
                                            }
                                            return true;
                                        }
                                    })}
                                    className={`input ${errors.start_date ? 'input-error' : ''}`}
                                />
                                {errors.start_date && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.start_date.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    min={startDate || (isEdit ? undefined : today)}
                                    {...register('end_date', {
                                        required: 'End date is required',
                                        validate: (value) => {
                                            if (startDate && value < startDate) {
                                                return 'End date cannot be earlier than start date';
                                            }
                                            return true;
                                        }
                                    })}
                                    className={`input ${errors.end_date ? 'input-error' : ''}`}
                                />
                                {errors.end_date && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.end_date.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Price (USD) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    id="price"
                                    step="0.01"
                                    min="0"
                                    max="10000"
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: { value: 0, message: 'Price cannot be negative' },
                                        max: { value: 10000, message: 'Price cannot exceed 10,000' }
                                    })}
                                    className={`input pl-8 ${errors.price ? 'input-error' : ''}`}
                                    placeholder="1,299"
                                />
                            </div>
                            {errors.price && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Image {!isEdit && '*'}
                                {isEdit && <span className="text-gray-400 font-normal"> (leave empty to keep current)</span>}
                            </label>
                            <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                                imagePreview ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                                {imagePreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setSelectedFile(null);
                                            }}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
                                        <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF, WEBP</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            {!isEdit && !selectedFile && !imagePreview && (
                                <p className="mt-1.5 text-sm text-red-500">Image is required</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 btn btn-secondary py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || (!isEdit && !selectedFile)}
                                className="flex-1 btn btn-primary py-3"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (isEdit ? 'Update Vacation' : 'Create Vacation')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VacationForm;
