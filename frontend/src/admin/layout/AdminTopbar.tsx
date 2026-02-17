import { AppBar, Box, IconButton, Toolbar, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../auth/AuthContext";

export default function AdminTopbar({ onMenu }: { onMenu: () => void }) {
    const { user, logout } = useAuth();

    return (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
            <Toolbar>
                <IconButton sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }} onClick={onMenu}>
                    <MenuIcon />
                </IconButton>

                <Typography fontWeight={800} sx={{ flex: 1 }}>
                    Адмінка
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography sx={{ opacity: 0.75, fontSize: 14 }}>
                        {user?.name}
                    </Typography>
                    <Button onClick={logout} variant="outlined" size="small">
                        Вийти
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
