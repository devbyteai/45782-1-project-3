import { Navigate } from 'react-router-dom';
import authService from '../../../services/auth';

interface AdminRouteProps {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/vacations" replace />;
    }

    return <>{children}</>;
}
