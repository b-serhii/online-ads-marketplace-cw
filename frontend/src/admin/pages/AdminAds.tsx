import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Box, Chip, Avatar, Tooltip, CircularProgress, Stack, Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { api } from '../../services/api';

const BACKEND_URL = 'http://localhost:8000';

export default function AdminAds() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAds = async () => {
        try {
            const { data } = await api.get('/admin/ads');
            setAds(data);
        } catch (error) {
            console.error("Помилка завантаження оголошень:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAds(); }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити це оголошення як адміністратор?")) {
            try {
                await api.delete(`/admin/ads/${id}`);
                setAds(ads.filter(ad => ad.id !== id));
            } catch (error) {
                alert("Помилка при видаленні");
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 900, color: '#1e293b' }}>
                Модерація оголошень
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 4px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Прев'ю</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Назва</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Категорія</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ціна</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Дата публікації</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ads.map((ad) => (
                            <TableRow key={ad.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Avatar
                                        variant="rounded"
                                        src={ad.image_url ? `${BACKEND_URL}${ad.image_url}` : ''}
                                        sx={{ width: 56, height: 56, bgcolor: '#e2e8f0' }}
                                    >
                                        {ad.title[0]}
                                    </Avatar>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{ad.title}</TableCell>
                                <TableCell>
                                    <Chip label={ad.category} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                </TableCell>
                                <TableCell sx={{ color: '#6366f1', fontWeight: 800 }}>{ad.price} ₴</TableCell>
                                <TableCell sx={{ color: '#64748b' }}>
                                    {new Date(ad.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Переглянути">
                                            <IconButton size="small" sx={{ color: '#64748b' }}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Видалити">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(ad.id)}
                                                sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}