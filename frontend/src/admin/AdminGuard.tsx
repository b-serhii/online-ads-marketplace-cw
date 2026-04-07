import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type {ReactNode} from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) return null; // або spinner
    if (!user) return <Navigate to="/login" replace />;
    if (!user.is_admin) return <Navigate to="/home" replace />;

    return <>{children}</>;
}
