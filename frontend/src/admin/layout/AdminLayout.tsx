import * as React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    Chip,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../auth/AuthContext.tsx";

const drawerWidth = 280;

export default function AdminLayout() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMobile = () => setMobileOpen((v) => !v);

    const navItems = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { to: "/admin/users", label: "Користувачі", icon: <PeopleIcon /> },
    ];

    const drawer = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ px: 2.2, py: 2 }}>
                <Typography sx={{ fontWeight: 900, letterSpacing: 0.3 }} variant="h6">
                    Admin Panel
                </Typography>

                <Typography sx={{ opacity: 0.7, mt: 0.5, fontSize: 13 }}>
                    Online Ads Marketplace
                </Typography>

                <Box sx={{ mt: 1.4, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                    <Chip size="small" label={user?.name ?? "Admin"} />
                    <Chip size="small" color="primary" variant="outlined" label="Admin" />
                </Box>
            </Box>

            <Divider />

            <List sx={{ px: 1.2, py: 1 }}>
                {navItems.map((item) => (
                    <ListItemButton
                        key={item.to}
                        component={NavLink}
                        to={item.to}
                        sx={{
                            borderRadius: 2,
                            my: 0.4,
                            "&.active": {
                                bgcolor: "rgba(25,118,210,0.10)",
                                "& .MuiListItemIcon-root": { color: "primary.main" },
                                "& .MuiListItemText-primary": { fontWeight: 800 },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ mt: "auto", p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    sx={{ borderRadius: 2, py: 1.1, fontWeight: 800, textTransform: "none" }}
                >
                    Вийти
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F6F8FB" }}>
            <CssBaseline />

            {/* TopBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255,255,255,.9)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(15,23,42,.08)",
                    color: "text.primary",
                    ml: { md: `${drawerWidth}px` },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar sx={{ gap: 1 }}>
                    {!isMdUp && (
                        <IconButton onClick={toggleMobile} edge="start" aria-label="open drawer">
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography sx={{ fontWeight: 900 }} variant="h6">
                        Адмінка
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <Typography sx={{ opacity: 0.75, fontSize: 14 }}>
                        Увійшов: <b>{user?.name}</b>
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ ml: 1, borderRadius: 2, textTransform: "none", fontWeight: 800 }}
                        onClick={() => navigate("/home")}
                    >
                        На сайт
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Drawer (desktop) */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant={isMdUp ? "permanent" : "temporary"}
                    open={isMdUp ? true : mobileOpen}
                    onClose={toggleMobile}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            borderRight: "1px solid rgba(15,23,42,.08)",
                            bgcolor: "rgba(255,255,255,.9)",
                            backdropFilter: "blur(10px)",
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    mt: 8, // під AppBar
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
