import { Navigate } from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";

interface ProtectedRouteProps{
    children: React.ReactNode;
}
export const ProtectedRoute = ({children} : ProtectedRouteProps) => {
    const {
        isAuthenticated,
        loading
    } = useAuth()
    if (loading){
        return(
            <div className="loading-screen">
                <div className="spinner">Loading...</div>
            </div>
        )
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}