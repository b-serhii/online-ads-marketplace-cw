import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, CircularProgress,
    Button, Fade, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Alert
} from '@mui/material';

import {Grid as Grid } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import { api } from '../services/api';

interface Ad {
    id: number;
    title: string;
    price: number;
    category: string;
    image_url: string | null;
    description: string;
    created_at: string;
}

export default function MyAds() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        try {
            const response = await api.get('/ads/my/all');
            setAds(response.data);
        } catch (err) {
            setError('Не вдалося завантажити ваші оголошення');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/ads/${deleteId}`);
            setAds(ads.filter(ad => ad.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            alert('Помилка при видаленні');
        }
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Navbar />
            <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            <Navbar />
            <Fade in timeout={600}>
                <Container maxWidth="lg" sx={{ mt: 6 }}>
                    <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                Мої оголошення
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                                Управління вашими опублікованими товарами
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    {ads.length === 0 ? (
                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, bgcolor: '#fff', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                У вас ще немає активних оголошень
                            </Typography>
                            <Button variant="contained" href="/create-ad" sx={{ mt: 2, borderRadius: 3 }}>
                                Створити перше оголошення
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {ads.map((ad) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ad.id} sx={{ position: 'relative' }}>
                                    <AdCard ad={ad} />

                                    <Box sx={{
                                        position: 'absolute', top: 25, right: 15, zIndex: 2,
                                        display: 'flex', gap: 1, bgcolor: 'rgba(255,255,255,0.9)',
                                        p: 0.5, borderRadius: 2, boxShadow: 1
                                    }}>
                                        <IconButton size="small" color="primary">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(ad.id);
                                            }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Fade>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle sx={{ fontWeight: 700 }}>Видалити оголошення?</DialogTitle>
                <DialogContent>
                    <Typography>Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо буде скасувати.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteId(null)} color="inherit">Скасувати</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">Видалити</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}