import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../endpoints/routing";
import LoadingSpinner from "../../components/general/LoadingSpinner";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const check = async () => {
            try {
                const res = await isAuthenticated();
                if (res.success) {
                    setAllowed(true);
                }
            } catch (err) {
                setAllowed(false);
            } finally {
                setLoading(false);
            }
        };
        check();
    }, []);

    if (loading) return <LoadingSpinner isLoading={true} />;

    if (!allowed) return <Navigate to="/catalog" replace />;

    return <>{children}</>;
};

export default ProtectedRoute;