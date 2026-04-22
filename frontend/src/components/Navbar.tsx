import { AppBar, Button, Toolbar, Typography, Container, Avatar, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AddIcon from '@mui/icons-material/Add';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateAdClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/create-ad');
        }
    };

    const BACKEND_URL = 'http://localhost:8000';
    const avatarSrc = user?.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `${BACKEND_URL}${user.avatar}`)
        : undefined;

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={0}
            sx={{
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 1100
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* ЛОГОТИП */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: isMobile ? 1 : 0,
                            mr: 4,
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 900,
                            letterSpacing: '-1px',
                            fontSize: '1.5rem'
                        }}
                    >
                        Online Ads
                    </Typography>

                    {/* Навігація */}
                    {!isMobile && (
                        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
                            <Button component={Link} to="/marketplace" color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                                Маркетплейс
                            </Button>
                        </Stack>
                    )}

                    {/* Меню справа */}
                    <Stack direction="row" spacing={isMobile ? 1 : 2} alignItems="center">
                        <Button
                            onClick={handleCreateAdClick}
                            variant="contained"
                            startIcon={<AddIcon />}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: isMobile ? 2 : 3
                            }}
                        >
                            {isMobile ? "Подати" : "Подати оголошення"}
                        </Button>

                        {isAuthenticated ? (
                            <>
                                {!isMobile && (
                                    <Button component={Link} to="/my-ads" color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                                        Мої товари
                                    </Button>
                                )}

                                <Button
                                    component={Link}
                                    to="/profile"
                                    color="inherit"
                                    sx={{ textTransform: 'none', borderRadius: '50px', p: isMobile ? 0 : 0.5, pr: isMobile ? 0 : 2 }}
                                    startIcon={
                                        <Avatar src={avatarSrc} alt={user?.name} sx={{ width: 36, height: 36 }}>
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    }
                                >
                                    {!isMobile && (
                                        <Typography variant="body2" fontWeight={700} sx={{ ml: 0.5 }}>
                                            {user?.name || 'Профіль'}
                                        </Typography>
                                    )}
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleLogout}
                                    sx={{ borderRadius: '8px', textTransform: 'none', display: isMobile ? 'none' : 'inline-flex' }}
                                >
                                    Вийти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login" sx={{ textTransform: 'none', fontWeight: 600 }}>
                                    Вхід
                                </Button>
                                {!isMobile && (
                                    <Button variant="outlined" component={Link} to="/register" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
                                        Реєстрація
                                    </Button>
                                )}
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;