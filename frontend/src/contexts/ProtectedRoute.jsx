import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export const ChannelOnlyRoute = ({ children }) => {
    const { currentActiveChannelId, isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (!currentActiveChannelId) {
        return <Navigate to="/create-channel" replace />;
    }

    return children;
};

export default ProtectedRoute;
