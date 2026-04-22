import { useEffect, useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, IconButton, Avatar, Chip, Stack, Tooltip
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BlockIcon from '@mui/icons-material/Block';
import { api } from '../../services/api'; // Переконайся, що шлях до api вірний

export default function AdminAdsManagement() {
    const [ads, setAds] = useState<any[]>([]);

    const loadAds = async () => {
        try {
            // Запит йде до твого ads.py через API
            const { data } = await api.get('/admin/ads');
            setAds(data);
        } catch (error) {
            console.error("Помилка завантаження оголошень:", error);
        }
    };

    useEffect(() => { loadAds(); }, []);

    const deleteAd = async (id: number) => {
        if (window.confirm("Видалити це оголошення назавжди?")) {
            await api.delete(`/admin/ads/${id}`);
            loadAds(); // Оновлюємо список після видалення
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 900, color: '#0B1220' }}>
                Модерація оголошень
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Товар</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Категорія</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ціна</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Автор (ID)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ads.map((ad) => (
                            <TableRow key={ad.id} hover>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            variant="rounded"
                                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${ad.image_url}`}
                                            sx={{ width: 45, height: 45, bgcolor: '#eee' }}
                                        />
                                        <Typography sx={{ fontWeight: 600 }}>{ad.title}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell><Chip label={ad.category} size="small" /></TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#6366f1' }}>{ad.price} ₴</TableCell>
                                <TableCell>ID: {ad.user_id}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Заблокувати"><IconButton color="warning"><BlockIcon /></IconButton></Tooltip>
                                    <Tooltip title="Видалити"><IconButton color="error" onClick={() => deleteAd(ad.id)}><DeleteSweepIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
