import {
    Box,
    Divider,
    List,
    ListItemIcon,
    ListItemText,
    Typography,
    ListItemButton
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"; // Імпорт іконки для оголошень
import { NavLink } from "react-router-dom";

// Стилі для елементів меню
const navItemSx = {
    borderRadius: 2,
    mx: 1.5,
    my: 0.5,
    transition: 'all 0.2s',
    "&.active": {
        bgcolor: "rgba(99,102,241,.18)",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: "#6366f1", // Акцентний колір для активного пункту
            fontWeight: 700
        },
    },
    "&:hover": {
        bgcolor: "rgba(255,255,255,.04)"
    }
};

export default function AdminSidebar() {
    return (
        <Box
            sx={{
                width: 280,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bgcolor: "#0B1220",
                color: "rgba(255,255,255,.85)",
                borderRight: "1px solid rgba(255,255,255,.08)",
                display: { xs: "none", md: "block" },
            }}
        >
            {/* Логотип та назва */}
            <Box sx={{ px: 2.2, py: 3 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 20, letterSpacing: 0.6, color: "#fff" }}>
                    Online Ads
                </Typography>
                <Typography sx={{ fontSize: 12, opacity: 0.65, mt: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Admin Panel
                </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,.08)", mb: 1 }} />

            <List sx={{ py: 0 }}>
                {/* Dashboard */}
                <ListItemButton component={NavLink} to="/admin/dashboard" sx={navItemSx}>
                    <ListItemIcon sx={{ minWidth: 38, color: "rgba(255,255,255,.65)" }}>
                        <DashboardOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Дашборд" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItemButton>

                {/* Користувачі */}
                <ListItemButton component={NavLink} to="/admin/users" sx={navItemSx}>
                    <ListItemIcon sx={{ minWidth: 38, color: "rgba(255,255,255,.65)" }}>
                        <PeopleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="Користувачі" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItemButton>

                {/* Оновлено: Всі оголошення (тепер у стилі NavLink) */}
                <ListItemButton component={NavLink} to="/admin/ads" sx={navItemSx}>
                    <ListItemIcon sx={{ minWidth: 38, color: "rgba(255,255,255,.65)" }}>
                        <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Всі оголошення" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItemButton>
            </List>

            {/* Бокс із порадою */}
            <Box sx={{ px: 2, position: 'absolute', bottom: 20, width: '100%' }}>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                    }}
                >
                    <Typography sx={{ fontSize: 11, color: "#6366f1", fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
                        Системна порада
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
                        Перевір статус `is_admin`
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, opacity: 0.6, lineHeight: 1.4 }}>
                        Права доступу синхронізуються з базою даних через `/auth/me`.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}