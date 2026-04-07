import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Chip,
    Divider, Paper, CircularProgress, Fade, Stack
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Імпорт Grid v6
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { api } from '../../services/api';

const BACKEND_URL = 'http://localhost:8000';

export default function AdDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const { data } = await api.get(`/ads/${id}`);
                setAd(data);
            } catch (error) {
                console.error("Помилка:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress thickness={2} size={60} sx={{ color: '#6366f1' }} />
        </Box>
    );

    if (!ad) return <Typography sx={{ p: 5, textAlign: 'center' }}>Оголошення не знайдено</Typography>;

    return (
        <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: 4 }}>
            <Fade in timeout={800}>
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ mb: 4, textTransform: 'none', fontWeight: 700, color: '#64748b' }}
                    >
                        Назад до списку
                    </Button>

                    {/* Виправлено: Grid container без item props */}
                    <Grid container spacing={5}>

                        {/* ЛІВА ЧАСТИНА: ФОТО (використовуємо size) */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Paper sx={{
                                borderRadius: 8, overflow: 'hidden', elevation: 0,
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                            }}>
                                <img
                                    src={ad.image_url ? `${BACKEND_URL}${ad.image_url}` : '/no-image.png'}
                                    style={{ width: '100%', display: 'block', maxHeight: '600px', objectFit: 'contain' }}
                                    alt={ad.title}
                                />
                            </Paper>
                        </Grid>

                        {/* ПРАВА ЧАСТИНА: ІНФО */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Paper sx={{ p: 4, borderRadius: 8, border: '1px solid #f1f5f9' }}>
                                <Chip
                                    label={ad.category}
                                    sx={{ mb: 2, fontWeight: 700, bgcolor: '#f0f4ff', color: '#6366f1' }}
                                />
                                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: '#1e293b', letterSpacing: '-1px' }}>
                                    {ad.title}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, color: '#94a3b8' }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        Опубліковано: {new Date(ad.created_at).toLocaleDateString()}
                                    </Typography>
                                </Stack>

                                <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#6366f1' }}>
                                    {ad.price.toLocaleString()} ₴
                                </Typography>

                                <Divider sx={{ mb: 4 }} />

                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
                                    Опис товару
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 4 }}>
                                    {ad.description}
                                </Typography>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{
                                        py: 2, borderRadius: 4, fontWeight: 800, fontSize: '1.1rem',
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
                                    }}
                                >
                                    Написати продавцю
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Fade>
        </Box>
    );
}