import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../../services/auth';
import { RegisterDTO } from '../../models/User';

function RegisterForm() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterDTO>();

    const onSubmit = async (data: RegisterDTO) => {
        try {
            setLoading(true);
            setError(null);
            await authService.register(data);
            navigate('/vacations');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4">
                        <span className="text-white text-3xl">✈</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                    <p className="text-gray-500 mt-1">Start your journey with Vacations</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    {...register('first_name', {
                                        required: 'First name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Min 2 characters'
                                        }
                                    })}
                                    className={`input ${errors.first_name ? 'input-error' : ''}`}
                                    placeholder="John"
                                />
                                {errors.first_name && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    {...register('last_name', {
                                        required: 'Last name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Min 2 characters'
                                        }
                                    })}
                                    className={`input ${errors.last_name ? 'input-error' : ''}`}
                                    placeholder="Doe"
                                />
                                {errors.last_name && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.last_name.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email'
                                    }
                                })}
                                className={`input ${errors.email ? 'input-error' : ''}`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 4,
                                        message: 'Password must be at least 4 characters'
                                    }
                                })}
                                className={`input ${errors.password ? 'input-error' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
