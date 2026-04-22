import { useEffect, useState } from 'react';
import {
    Typography, Button, Card, CardMedia, Box, CircularProgress,
    Stack, Chip, Snackbar, Alert, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CollectionsIcon from '@mui/icons-material/Collections';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import { api } from '../services/api';

import EditAdModal from './EditAdModal';
import DeleteAdDialog from './DeleteDialog';

const BACKEND_URL = 'http://localhost:8000';

export default function MyAdsList() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<any>(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const fetchMyAds = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/ads/my/all');
            setAds(data);
        } catch (error) {
            setSnackbar({ open: true, message: 'Не вдалося завантажити список', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyAds(); }, []);

    const handleEditClick = (ad: any) => {
        setSelectedAd(ad);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (ad: any) => {
        setSelectedAd(ad);
        setDeleteDialogOpen(true);
    };

    const getImageUrl = (ad: any) => {
        const url = ad.image_url || (ad.images_urls && ad.images_urls[0]);
        if (!url) return '/no-image.png';
        if (url.startsWith('http')) return url;
        return `${BACKEND_URL}${url}`;
    };

    async function confirmDelete() {
        if (!selectedAd) return;
        try {
            await api.delete(`/ads/${selectedAd.id}`);
            setSnackbar({ open: true, message: 'Оголошення видалено', severity: 'success' });
            setDeleteDialogOpen(false);
            fetchMyAds();
        } catch (error) {
            setSnackbar({ open: true, message: 'Помилка при видаленні', severity: 'error' });
        }
    }

    async function handleSaveEdit(formData: FormData) {
        if (!selectedAd) return;
        try {
            await api.put(`/ads/${selectedAd.id}`, formData);
            setSnackbar({ open: true, message: 'Зміни збережено!', severity: 'success' });
            setEditModalOpen(false);
            fetchMyAds();
        } catch (error) {
            setSnackbar({ open: true, message: 'Помилка збереження', severity: 'error' });
        }
    }

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 10, color: '#6366f1' }} />;

    return (
        <Box sx={{ mt: 3, pb: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, color: '#1e293b' }}>
                Мої оголошення ({ads.length})
            </Typography>

            {ads.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 6, bgcolor: '#f8fafc', border: '2px dashed #e2e8f0' }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                        Ви ще не додали жодного оголошення.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {ads.map(ad => {
                        const isEdited = ad.updated_at && (new Date(ad.updated_at).getTime() - new Date(ad.created_at).getTime() > 60000);

                        return (
                            <Card key={ad.id} sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                borderRadius: 6,
                                overflow: 'hidden',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }
                            }}>
                                <Box sx={{ position: 'relative', width: { xs: '100%', sm: 240 }, height: 200 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        image={getImageUrl(ad)}
                                    />

                                    {/* БРОНЕБІЙНИЙ БЛОК З ІКОНКАМИ */}
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: 3,
                                            p: 0.5,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            backdropFilter: 'blur(4px)',
                                            zIndex: 9999, // Максимальний шар
                                            pointerEvents: 'auto' // Примусовий клік
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEditClick(ad);
                                            }}
                                            sx={{ color: '#6366f1' }}
                                        >
                                            <EditRoundedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteClick(ad);
                                            }}
                                            sx={{ color: '#ef4444' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>

                                    {ad.images_urls && ad.images_urls.length > 1 && (
                                        <Chip
                                            icon={<CollectionsIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                                            label={ad.images_urls.length}
                                            sx={{
                                                position: 'absolute', top: 12, left: 12,
                                                bgcolor: 'rgba(15, 23, 42, 0.7)', color: '#fff',
                                                fontWeight: 800, backdropFilter: 'blur(4px)', height: 24
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 3 }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                {ad.title}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#6366f1' }}>
                                                {ad.price} ₴
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Chip label={ad.category} size="small" sx={{ fontWeight: 700, bgcolor: '#eff6ff', color: '#6366f1' }} />
                                            {isEdited && (
                                                <Chip
                                                    icon={<UpdateRoundedIcon style={{ fontSize: 14 }} />}
                                                    label="Змінено"
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', borderColor: '#e2e8f0' }}
                                                />
                                            )}
                                        </Stack>

                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {ad.description}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            startIcon={<EditRoundedIcon />}
                                            onClick={() => handleEditClick(ad)}
                                            sx={{
                                                borderRadius: 3, px: 3, textTransform: 'none', fontWeight: 800,
                                                bgcolor: '#f1f5f9', color: '#1e293b', boxShadow: 'none',
                                                '&:hover': { bgcolor: '#e2e8f0', boxShadow: 'none' }
                                            }}
                                        >
                                            Редагувати
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteClick(ad)}
                                            sx={{
                                                borderRadius: 3, px: 3, textTransform: 'none', fontWeight: 800,
                                                bgcolor: '#fee2e2', color: '#ef4444', boxShadow: 'none',
                                                '&:hover': { bgcolor: '#fecaca', boxShadow: 'none' }
                                            }}
                                        >
                                            Видалити
                                        </Button>
                                    </Stack>
                                </Box>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            <DeleteAdDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                adTitle={selectedAd?.title}
            />

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