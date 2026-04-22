import { useEffect, useState } from 'react';
import { Typography, Button, Card, CardMedia, Box, CircularProgress, Stack, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CollectionsIcon from '@mui/icons-material/Collections'; // Іконка галереї
import { api } from '../services/api';

import EditAdModal from './EditAdModal';
import DeleteAdDialog from './DeleteDialog';

export default function MyAdsList() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<any>(null);

    const fetchMyAds = async () => {
        setLoading(true);
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

    const handleEditClick = (ad: any) => {
        setSelectedAd(ad);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (ad: any) => {
        setSelectedAd(ad);
        setDeleteDialogOpen(true);
    };

    const getImageUrl = (url: string | null) => {
        if (!url) return '/no-image.png';
        if (url.startsWith('http')) return url;
        return `http://localhost:8000${url}`;
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, color: '#1e293b' }}>
                Мої оголошення
            </Typography>

            {ads.length === 0 ? (
                <Typography color="text.secondary">Ви ще не додали жодного оголошення.</Typography>
            ) : (
                <Stack spacing={3}>
                    {ads.map(ad => (
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
                            <Box sx={{ position: 'relative', width: { xs: '100%', sm: 240 }, height: 180 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    image={getImageUrl(ad.image_url)}
                                />
                                {ad.images_urls && ad.images_urls.length > 1 && (
                                    <Chip
                                        icon={<CollectionsIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                                        label={ad.images_urls.length}
                                        sx={{
                                            position: 'absolute', top: 12, left: 12,
                                            bgcolor: 'rgba(15, 23, 42, 0.7)', color: '#fff',
                                            fontWeight: 700, backdropFilter: 'blur(4px)', height: 24
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Секція контенту */}
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
                                    <Chip label={ad.category} size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: '#f1f5f9' }} />
                                    <Typography variant="body2" sx={{ color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {ad.description}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ mt: { xs: 3, sm: 0 } }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<EditRoundedIcon />}
                                        onClick={() => handleEditClick(ad)}
                                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Редагувати
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteClick(ad)}
                                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, bgcolor: '#fee2e2', color: '#ef4444', boxShadow: 'none', '&:hover': { bgcolor: '#fecaca', boxShadow: 'none' } }}
                                    >
                                        Видалити
                                    </Button>
                                </Stack>
                            </Box>
                        </Card>
                    ))}
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
        </Box>
    );

    async function confirmDelete() {
        if (!selectedAd) return;
        try {
            await api.delete(`/ads/${selectedAd.id}`);
            setDeleteDialogOpen(false);
            fetchMyAds();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSaveEdit(formData: FormData) {
        if (!selectedAd) return;
        try {
            await api.put(`/ads/${selectedAd.id}`, formData);
            setEditModalOpen(false);
            fetchMyAds();
        } catch (error) {
            console.error(error);
        }
    }
}