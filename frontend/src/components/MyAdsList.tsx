import { useEffect, useState } from 'react';
import { Typography, Button, Card, CardContent, CardMedia, Box, CircularProgress, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Імпорт Grid v6
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/api';

export default function MyAdsList() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyAds = async () => {
        try {
            const { data } = await api.get('/ads/my/all');
            setAds(data);
        } catch (error) {
            console.error("Помилка завантаження:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyAds(); }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Видалити це оголошення?")) {
            try {
                await api.delete(`/admin/ads/${id}`);
                fetchMyAds();
            } catch (error) {
                alert("Не вдалося видалити оголошення");
            }
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                Ваші публікації
            </Typography>

            {ads.length === 0 ? (
                <Typography color="text.secondary">Ви ще не додали жодного оголошення.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {ads.map(ad => (
                        /* ВИПРАВЛЕНО: Використовуємо size замість item та xs */
                        <Grid size={{ xs: 12 }} key={ad.id}>
                            <Card sx={{
                                display: 'flex',
                                borderRadius: 4,
                                border: '1px solid #f1f5f9',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 160, height: 120, objectFit: 'cover' }}
                                    image={ad.image_url ? `http://localhost:8000${ad.image_url}` : '/no-image.png'}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <CardContent sx={{ flex: '1 0 auto', py: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {ad.title}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                                            {ad.price} ₴
                                        </Typography>
                                    </CardContent>
                                    <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
                                        <Button
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(ad.id)}
                                            sx={{ textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Видалити
                                        </Button>
                                    </Stack>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}