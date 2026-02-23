import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner">Loading...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/transactions" replace />;
    }

    return <>{children}</>;
};