import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../../services/auth';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                            <span className="text-white text-xl">✈</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Vacations
                            </h1>
                            <p className="text-xs text-gray-500 hidden sm:block">Discover amazing destinations</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 sm:gap-2">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/vacations"
                                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                                        isActive('/vacations')
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Vacations</span>
                                    <span className="sm:hidden">🏖</span>
                                </Link>
                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/admin/vacations"
                                            className={`px-3 py-2 rounded-lg font-medium transition-all ${
                                                isActive('/admin/vacations')
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="hidden sm:inline">Manage</span>
                                            <span className="sm:hidden">⚙</span>
                                        </Link>
                                        <Link
                                            to="/admin/reports"
                                            className={`px-3 py-2 rounded-lg font-medium transition-all ${
                                                isActive('/admin/reports')
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="hidden sm:inline">Reports</span>
                                            <span className="sm:hidden">📊</span>
                                        </Link>
                                    </>
                                )}

                                <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />

                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {user?.firstName}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                                    >
                                        <span className="hidden sm:inline">Logout</span>
                                        <span className="sm:hidden">🚪</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
