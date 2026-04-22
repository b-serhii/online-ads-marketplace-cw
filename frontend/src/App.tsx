import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AdDetail from "./admin/pages/AdDetail.tsx";
import CreateAd from "./pages/CreateAd";
import MyAds from "./pages/MyAds";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import AdminAdsManagement from "./admin/pages/AdminAdsManagement";
import AdDetails from "./pages/AdDetails";
import VerifyEmail from './pages/VerifyEmail';
import Marketplace from "./pages/Marketplace";


import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1',
            dark: '#4f46e5',
            contrastText: '#fff',
        },
        secondary: {
            main: '#a855f7',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        error: {
            main: '#ef4444',
        },
    },
    shape: {
        borderRadius: 5,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: { fontWeight: 800 },
        button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '8px 20px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '28px',
                },
            },
        },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/ad/:id" element={<AdDetails />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/create-ad" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
                <Route path="/my-ads" element={<ProtectedRoute><MyAds /></ProtectedRoute>} />

                <Route path="/ads/:id" element={<ProtectedRoute><AdDetail /></ProtectedRoute>} />

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
                    <Route path="ads" element={<AdminAdsManagement />} />
                </Route>

                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </ThemeProvider>
    );
}