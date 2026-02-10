import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import AppleIcon from '@mui/icons-material/Apple'; // 👈 1. Імпорт є

const Navbar = () => {
    return (
        <AppBar position="fixed" className="navbar-glass">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', height: '64px' }}>

                    {/* Логотип */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <AppleIcon sx={{ color: '#1d1d1f', pb: 0.5 }} />

                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.5px' }}>
                            <Link to="/">Marketplace.</Link>
                        </Typography>
                    </Box>

                    {/* Меню */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Button component={Link} to="/login" className="btn-text">
                            Увійти
                        </Button>
                        <Button component={Link} to="/register" className="btn-primary">
                            Створити акаунт
                        </Button>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;