import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Button, CircularProgress,
    Paper, Avatar, Divider, Chip, Stack
} from "@mui/material";
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
                        '&:hover': { color: '#0f172a' }
                    }}
                >
                    Назад до пошуку
                </Button>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4
                }}>

                    {/* ЛІВА ЧАСТИНА (ФОТО) */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{
                            borderRadius: 6,
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0'
                        }}>

                            {/* ВЕЛИКЕ ФОТО */}
                            <Box sx={{
                                height: { xs: 300, md: 500 },
                                bgcolor: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
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
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://via.placeholder.com/600x400?text=Помилка';
                                        }}
                                    />
                                ) : (
                                    <Typography>Немає фото</Typography>
                                )}
                            </Box>

                            {/*ГАЛЕРЕЯ */}
                            {ad.allImages && ad.allImages.length > 1 && (
                                <Box sx={{
                                    p: 2,
                                    display: 'flex',
                                    gap: 2,
                                    overflowX: 'auto'
                                }}>
                                    {ad.allImages.map((url: string, index: number) => (
                                        <Box
                                            key={index}
                                            onClick={() => setActiveImage(url)}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: '2px solid',
                                                borderColor: activeImage === url
                                                    ? '#6366f1'
                                                    : 'transparent'
                                            }}
                                        >
                                            <img
                                                src={getFullImageUrl(url)!}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* ТЕКСТ */}
                            <Box sx={{ p: 4 }}>
                                <Chip label={ad.category} sx={{ mb: 2 }} />

                                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                                    {ad.title}
                                </Typography>

                                <Typography variant="h3" sx={{ color: '#6366f1', my: 2 }}>
                                    {ad.price} ₴
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography>
                                    {ad.description}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* ПРАВА ЧАСТИНА */}
                    <Box sx={{ width: 320 }}>
                        <Paper sx={{ p: 3, borderRadius: 6 }}>
                            <Typography variant="h6">Продавець</Typography>

                            <Stack direction="row" spacing={2} mt={2}>
                                <Avatar src={getFullImageUrl(ad.author_avatar) || undefined}>
                                    <PersonIcon />
                                </Avatar>

                                <Box>
                                    <Typography fontWeight={700}>
                                        {ad.author_name}
                                    </Typography>
                                    <Typography fontSize={12}>
                                        На сайті з 2026 року
                                    </Typography>
                                </Box>
                            </Stack>

                            <Button
                                fullWidth
                                sx={{ mt: 3 }}
                                variant="contained"
                                onClick={handlePhoneClick}
                                startIcon={<PhoneIcon />}
                            >
                                {showPhone
                                    ? (ad.author_phone || "Немає")
                                    : "Показати телефон"}
                            </Button>
                        </Paper>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default AdDetails;