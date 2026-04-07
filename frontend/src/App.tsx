import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AdDetail from "./admin/pages/AdDetail.tsx";
import CreateAd from "./pages/CreateAd";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import AdminAdsManagement from "./admin/pages/AdminAdsManagement";
import AdDetails from "./pages/AdDetails";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ad/:id" element={<AdDetails />} />

            {/* Публічні або захищені маршрути оголошень */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route path="/ads/:id" element={<ProtectedRoute><AdDetail /></ProtectedRoute>} />
            <Route path="/create-ad" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Адмін-панель */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="ads" element={<AdminAdsManagement />} /> {/* Тепер шлях /admin/ads запрацює */}
            </Route>

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}