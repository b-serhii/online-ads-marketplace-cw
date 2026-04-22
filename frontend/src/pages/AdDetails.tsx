import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Button, CircularProgress,
    Paper, Avatar, Divider, Chip, Stack
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import Navbar from "../components/Navbar";
import { api } from "../services/api";

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPhone, setShowPhone] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const isAuthenticated = !!localStorage.getItem("token");

    const getFullImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${BACKEND_URL}${url}`;
    };

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`/ads/${id}`);
                const data = response.data;

                const allImages =
                    data.images_urls && data.images_urls.length > 0
                        ? data.images_urls
                        : data.image_url
                            ? [data.image_url]
                            : [];

                const preparedAd = {
                    ...data,
                    allImages
                };

                setAd(preparedAd);
                setActiveImage(allImages[0] || null);

            } catch (error) {
                console.error("Помилка завантаження:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    const handlePhoneClick = () => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            setShowPhone(true);
        }
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Navbar />
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress size={50} sx={{ color: '#6366f1' }} />
            </Box>
        </Box>
    );

    if (!ad) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Navbar />
            <Typography variant="h5" textAlign="center" mt={10} sx={{ fontWeight: 600, color: '#64748b' }}>
                Оголошення не знайдено 😕
            </Typography>
        </Box>
    );

    const isEdited = ad.updated_at && (new Date(ad.updated_at).getTime() - new Date(ad.created_at).getTime() > 60000);

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 3,
                        textTransform: 'none',
                        color: '#64748b',
                        fontWeight: 700,
                        '&:hover': { color: '#0f172a', bgcolor: 'transparent' }
                    }}
                >
                    Назад до пошуку
                </Button>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    alignItems: 'flex-start'
                }}>

                    {/* ЛІВА ЧАСТИНА (ФОТО ТА ОПИС) */}
                    <Box sx={{ flex: 1, width: '100%' }}>
                        <Paper elevation={0} sx={{
                            borderRadius: 6,
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            bgcolor: '#fff'
                        }}>

                            <Box sx={{
                                height: { xs: 300, md: 500 },
                                bgcolor: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                {activeImage ? (
                                    <img
                                        src={getFullImageUrl(activeImage)!}
                                        alt={ad.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <Typography color="textSecondary">Немає фото</Typography>
                                )}
                            </Box>

                            {ad.allImages && ad.allImages.length > 1 && (
                                <Box sx={{
                                    p: 2,
                                    display: 'flex',
                                    gap: 1.5,
                                    overflowX: 'auto',
                                    '&::-webkit-scrollbar': { height: '6px' },
                                    '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '10px' }
                                }}>
                                    {ad.allImages.map((url: string, index: number) => (
                                        <Box
                                            key={index}
                                            onClick={() => setActiveImage(url)}
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                flexShrink: 0,
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: '2px solid',
                                                borderColor: activeImage === url ? '#6366f1' : 'transparent',
                                                transition: '0.2s',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}
                                        >
                                            <img
                                                src={getFullImageUrl(url)!}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* ТЕКСТОВИЙ КОНТЕНТ */}
                            <Box sx={{ p: { xs: 3, md: 5 } }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Chip
                                        label={ad.category}
                                        size="small"
                                        sx={{ bgcolor: '#eff6ff', color: '#6366f1', fontWeight: 800, px: 1 }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                        Опубліковано: {new Date(ad.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
                                    </Typography>

                                    {isEdited && (
                                        <Chip
                                            icon={<UpdateRoundedIcon style={{ fontSize: '14px', color: '#64748b' }} />}
                                            label={`Змінено: ${new Date(ad.updated_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
                                            size="small"
                                            sx={{
                                                bgcolor: '#f1f5f9',
                                                color: '#64748b',
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0'
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', mb: 1 }}>
                                    {ad.title}
                                </Typography>

                                <Typography variant="h3" sx={{ color: '#6366f1', fontWeight: 900, mb: 4 }}>
                                    {ad.price.toLocaleString()} ₴
                                </Typography>

                                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Опис товару</Typography>
                                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
                                    {ad.description || "Опис відсутній"}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: 340 }, position: { md: 'sticky' }, top: 24 }}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Продавець</Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    src={getFullImageUrl(ad.author_avatar) || undefined}
                                    sx={{ width: 56, height: 56, border: '1px solid #f1f5f9' }}
                                >
                                    <PersonIcon />
                                </Avatar>

                                <Box>
                                    <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                                        {ad.author_name || "Користувач"}
                                    </Typography>
                                    <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
                                        На сайті з 2026 року
                                    </Typography>
                                </Box>
                            </Stack>

                            <Button
                                fullWidth
                                variant={showPhone ? "outlined" : "contained"}
                                onClick={handlePhoneClick}
                                startIcon={<PhoneIcon />}
                                sx={{
                                    mt: 4,
                                    py: 1.8,
                                    borderRadius: 4,
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    boxShadow: showPhone ? 'none' : '0 10px 20px rgba(99, 102, 241, 0.2)',
                                    background: showPhone ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                    '&:hover': {
                                        background: showPhone ? '#f8fafc' : 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: '0.3s'
                                }}
                            >
                                {showPhone
                                    ? (ad.author_phone || "Номер не вказано")
                                    : "Показати телефон"}
                            </Button>

                            <Typography variant="caption" sx={{ display: 'block', mt: 3, textAlign: 'center', color: '#cbd5e1', fontWeight: 500 }}>
                                Скажіть продавцю, що знайшли оголошення на **Online Ads**
                            </Typography>
                        </Paper>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default AdDetails;
