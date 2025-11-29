import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "../../auth/LoginForm";
import RegisterForm from "../../auth/RegisterForm";
import VacationsPage from "../../../pages/VacationsPage";
import AdminVacationsPage from "../../../pages/AdminVacationsPage";
import AddVacationPage from "../../../pages/AddVacationPage";
import EditVacationPage from "../../../pages/EditVacationPage";
import ReportsPage from "../../../pages/ReportsPage";
import NotFound from "../not-found/NotFound";
import ProtectedRoute from "../protected-route/ProtectedRoute";
import AdminRoute from "../protected-route/AdminRoute";

export default function Main() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/vacations" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Protected routes for authenticated users */}
            <Route path="/vacations" element={
                <ProtectedRoute>
                    <VacationsPage />
                </ProtectedRoute>
            } />

            {/* Admin only routes */}
            <Route path="/admin/vacations" element={
                <AdminRoute>
                    <AdminVacationsPage />
                </AdminRoute>
            } />
            <Route path="/admin/vacations/add" element={
                <AdminRoute>
                    <AddVacationPage />
                </AdminRoute>
            } />
            <Route path="/admin/vacations/edit/:id" element={
                <AdminRoute>
                    <EditVacationPage />
                </AdminRoute>
            } />
            <Route path="/admin/reports" element={
                <AdminRoute>
                    <ReportsPage />
                </AdminRoute>
            } />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
