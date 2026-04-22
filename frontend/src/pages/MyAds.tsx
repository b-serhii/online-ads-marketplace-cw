import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, CircularProgress,
    Button, Fade, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Alert, Snackbar
} from '@mui/material';
import { Grid as Grid } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import EditAdModal from '../components/EditAdModal';
import { api } from '../services/api';

interface Ad {
    id: number;
    title: string;
    price: number;
    category: string;
    image_url: string | null;
    images_urls?: string[];
    description: string;
    created_at: string;
}

export default function MyAds() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        setLoading(true);
        try {
            const response = await api.get('/ads/my/all');
            setAds(response.data);
            setError('');
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
            setSnackbar({ open: true, message: 'Оголошення видалено', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Помилка при видаленні', severity: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    const handleEditClick = (ad: Ad) => {
        setSelectedAd(ad);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (formData: FormData) => {
        if (!selectedAd) return;
        try {
            await api.put(`/ads/${selectedAd.id}`, formData);
            setSnackbar({ open: true, message: 'Зміни успішно збережено!', severity: 'success' });
            setEditModalOpen(false);
            fetchMyAds();
        } catch (err) {
            setSnackbar({ open: true, message: 'Помилка збереження', severity: 'error' });
        }
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Navbar />
            <Box display="flex" justifyContent="center" mt={10}><CircularProgress sx={{ color: '#6366f1' }} /></Box>
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
                            <Button variant="contained" href="/create-ad" sx={{ mt: 2, borderRadius: 3, bgcolor: '#6366f1' }}>
                                Створити перше оголошення
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {ads.map((ad) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ad.id} sx={{ position: 'relative' }}>
                                    <AdCard ad={ad} />

                                    <Box sx={{
                                        position: 'absolute', top: 25, right: 15, zIndex: 10,
                                        display: 'flex', gap: 1, bgcolor: 'rgba(255,255,255,0.95)',
                                        p: 0.5, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#6366f1' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEditClick(ad);
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#ef4444' }}
                                            onClick={(e) => {
                                                e.preventDefault();
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

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Видалити оголошення?</DialogTitle>
                <DialogContent>
                    <Typography>Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо буде скасувати.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteId(null)} sx={{ color: '#64748b', fontWeight: 700 }}>Скасувати</Button>
                    <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700, boxShadow: 'none' }}>Видалити</Button>
                </DialogActions>
            </Dialog>

            <EditAdModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                adData={selectedAd}
                onSave={handleSaveEdit}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 4, fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}