import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Button, CircularProgress,
    Paper, Avatar, Divider, Chip
} from "@mui/material";
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import Navbar from "../components/Navbar";
import { api } from "../services/api";

const BACKEND_URL = 'http://localhost:8000';

const AdDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPhone, setShowPhone] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`/ads/${id}`);
                setAd(response.data);
            } catch (error) {
                console.error("Помилка завантаження оголошення:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    if (loading) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f5f8' }}>
            <Navbar />
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress size={50} sx={{ color: '#2563eb' }} />
            </Box>
        </Box>
    );

    if (!ad) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f5f8' }}>
            <Navbar />
            <Typography variant="h5" textAlign="center" mt={10} sx={{ fontWeight: 600, color: '#64748b' }}>
                Оголошення не знайдено 😕
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: '#f4f5f8', minHeight: '100vh', pb: 10 }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, textTransform: 'none', color: '#64748b', fontWeight: 600, '&:hover': { bgcolor: '#e2e8f0' } }}
                >
                    Назад до пошуку
                </Button>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', mb: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <Box
                                sx={{
                                    height: { xs: 300, md: 500 },
                                    bgcolor: '#e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {ad.image_url ? (
                                    <img src={`${BACKEND_URL}${ad.image_url}`} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Typography color="textSecondary" sx={{ fontWeight: 600 }}>Немає фото</Typography>
                                )}
                            </Box>
                            <Box sx={{ p: { xs: 3, md: 5 } }}>
                                <Chip label={ad.category} sx={{ mb: 2, bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600 }} />
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                                    {ad.title}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb', mb: 4 }}>
                                    {ad.price} ₴
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Опис</Typography>
                                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                    {ad.description || "Опис відсутній"}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Продавець</Typography>

                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar
                                    src={ad.author_avatar ? `${BACKEND_URL}${ad.author_avatar}` : undefined}
                                    sx={{ width: 56, height: 56, bgcolor: '#e2e8f0', color: '#475569' }}
                                >
                                    {ad.author_name ? ad.author_name.charAt(0).toUpperCase() : <PersonIcon />}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        {ad.author_name || "Користувач"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        На сайті з 2026 року
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant={showPhone ? "outlined" : "contained"}
                                size="large"
                                startIcon={<PhoneIcon />}
                                onClick={() => setShowPhone(true)}
                                disableElevation
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    bgcolor: showPhone ? 'transparent' : '#2563eb',
                                    color: showPhone ? '#0f172a' : '#fff',
                                    '&:hover': {
                                        bgcolor: showPhone ? '#f8fafc' : '#1d4ed8'
                                    }
                                }}
                            >
                                {showPhone ? (ad.author_phone || "Телефон не вказано") : "Показати телефон"}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AdDetails;