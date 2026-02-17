import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import { NavLink } from "react-router-dom";

const drawerWidth = 260;

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <ListItemButton
            component={NavLink}
            to={to}
            sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                "&.active": {
                    bgcolor: "rgba(25,118,210,.10)",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                },
            }}
        >
            <ListItemIcon sx={{ minWidth: 38 }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
}

export default function AdminSidebar({
                                         mobileOpen,
                                         onClose,
                                     }: {
    mobileOpen: boolean;
    onClose: () => void;
}) {
    const content = (
        <Box sx={{ height: "100%", bgcolor: "white" }}>
            <Toolbar sx={{ px: 2 }}>
                <Typography fontWeight={900}>Admin Panel</Typography>
            </Toolbar>
            <Divider />
            <List>
                <NavItem to="/admin/dashboard" icon={<DashboardIcon />} label="Dashboard" />
                <NavItem to="/admin/users" icon={<PeopleIcon />} label="Користувачі" />
            </List>
            <Divider />
            <Box sx={{ px: 2, py: 2, opacity: 0.7, fontSize: 12 }}>
                Online Ads • v1
            </Box>
        </Box>
    );

    return (
        <>
            {/* Mobile */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { width: drawerWidth },
                }}
            >
                {content}
            </Drawer>

            {/* Desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
                }}
                open
            >
                {content}
            </Drawer>
        </>
    );
}
