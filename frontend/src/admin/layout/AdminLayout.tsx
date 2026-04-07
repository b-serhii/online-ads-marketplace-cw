import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Переконайся, що шлях правильний

export default function AdminLayout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Фіксований сайдбар шириною 280px */}
            <AdminSidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { md: '280px' },
                    width: '100%',
                    p: 3
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}