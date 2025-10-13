import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth/AuthContext';

const ProtectedRoute = () => {
    const { token } = useAuth();
    console.log('ProtectedRoute');
    
    if (!token) {
        // Redirect to login page if not authenticated
        console.log('Redirecting to login page');
        return <Navigate to="/login" replace={true} />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;