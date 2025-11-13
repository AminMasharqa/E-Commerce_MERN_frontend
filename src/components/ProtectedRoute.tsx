import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth/AuthContext';

const ProtectedRoute = () => {
    const { token } = useAuth();
    
    if (!token) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace={true} />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;