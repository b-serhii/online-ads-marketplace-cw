import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#FFFFFF", color: "#0F172A", borderBottom: "1px solid rgba(15,23,42,.08)" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography sx={{ fontWeight: 900 }}>Адмінка</Typography>
                    <Typography sx={{ fontSize: 12, opacity: 0.7 }}>Керування системою</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography sx={{ fontSize: 14, opacity: 0.85 }}>
                        {user ? `Увійшов: ${user.name}` : ""}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2 }}
                    >
                        Вийти
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
