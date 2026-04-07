import { AppBar, Button, Toolbar, Typography, Container, Avatar, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AddIcon from '@mui/icons-material/Add';
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Базова адреса бекенду для картинок
    const BACKEND_URL = 'http://localhost:8000';

    return (
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* ЛОГОТИП */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'primary.main', // Використовуємо основний колір теми
                            fontWeight: 800,
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Online Ads
                    </Typography>

                    {/* МЕНЮ СПРАВА */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        {isAuthenticated ? (
                            <>
                                {/* Кнопка адмінки (лише для адмінів) */}
                                {user?.is_admin && (
                                    <Button
                                        variant="contained"
                                        color="error" // Червоний/помаранчевий колір, щоб виділявся
                                        size="small"
                                        component={Link}
                                        to="/admin"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        ADMIN PANEL
                                    </Button>
                                )}
                                <Button
                                    component={Link}
                                    to="/create-ad"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 700
                                    }}
                                >
                                    Подати оголошення
                                </Button>

                                {/* Кнопка Профілю */}
                                <Button
                                    component={Link}
                                    to="/profile"
                                    color="inherit"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '50px', // Заокруглена кнопка
                                        pl: 0.5,
                                        pr: 2,
                                        border: '1px solid transparent',
                                        '&:hover': { border: '1px solid #e0e0e0' }
                                    }}
                                    startIcon={
                                        <Avatar
                                            src={user?.avatar ? `${BACKEND_URL}${user.avatar}` : undefined}
                                            alt={user?.name}
                                            sx={{ width: 32, height: 32 }}
                                        >
                                            {/* Якщо немає фото, показуємо першу літеру */}
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    }
                                >
                                    <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>
                                        {user?.name || 'Мій профіль'}
                                    </Typography>
                                </Button>

                                {/* Кнопка Вийти */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleLogout}
                                    color="primary"
                                >
                                    Вийти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Вхід
                                </Button>
                                <Button variant="contained" component={Link} to="/register" disableElevation>
                                    Реєстрація
                                </Button>
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;