import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/home" replace />;

    return <>{children}</>;
}
