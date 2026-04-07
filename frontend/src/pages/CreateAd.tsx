import React, { useState } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box, MenuItem,
    Stack, InputAdornment, CircularProgress, Fade, Divider
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Категорії, що відповідають головній сторінці
const CATEGORIES = ["Електроніка", "Транспорт", "Нерухомість", "Робота", "Послуги", "Дім і сад"];

export default function CreateAd() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: CATEGORIES[0]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('price', form.price);
        fd.append('category', form.category);
        if (selectedFile) fd.append('file', selectedFile);

        try {
            await api.post('/ads/', fd);
            // Після успішного посту повертаємось на головну
            navigate('/home');
        } catch (error) {
            console.error("Помилка публікації:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #f8fafc, #eff6ff)', py: 8 }}>
            <Fade in timeout={800}>
                <Container maxWidth="sm">
                    <Paper elevation={0} sx={{
                        p: 5, borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.4)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)'
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: '#1e293b', letterSpacing: '-1px' }}>
                            Що продаєте?
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                            Заповніть деталі, щоб швидше знайти покупця
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {/* Завантаження фото */}
                                <Box
                                    sx={{
                                        width: '100%', height: 200, borderRadius: 6, bgcolor: '#f1f5f9',
                                        border: '2px dashed #cbd5e1', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', overflow: 'hidden', transition: '0.3s',
                                        '&:hover': { borderColor: '#6366f1', bgcolor: '#f8fafc' }
                                    }}
                                    onClick={() => document.getElementById('ad-file')?.click()}
                                >
                                    {preview ? (
                                        <img src={preview} alt="Прев'ю" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Stack alignItems="center" sx={{ color: '#64748b' }}>
                                            <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography variant="button">Додати головне фото</Typography>
                                        </Stack>
                                    )}
                                </Box>
                                <input type="file" id="ad-file" hidden accept="image/*" onChange={handleFileChange} />

                                <TextField
                                    label="Назва оголошення"
                                    variant="filled"
                                    fullWidth required
                                    value={form.title}
                                    onChange={(e) => setForm({...form, title: e.target.value})}
                                    slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                                />

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Категорія"
                                        select fullWidth variant="filled"
                                        value={form.category}
                                        onChange={(e) => setForm({...form, category: e.target.value})}
                                        slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        label="Ціна"
                                        type="number" variant="filled"
                                        fullWidth required
                                        value={form.price}
                                        onChange={(e) => setForm({...form, price: e.target.value})}
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">₴</InputAdornment>,
                                                sx: { borderRadius: '12px' }
                                            }
                                        }}
                                    />
                                </Stack>

                                <TextField
                                    label="Опис товару"
                                    multiline rows={4} variant="filled"
                                    fullWidth required
                                    value={form.description}
                                    onChange={(e) => setForm({...form, description: e.target.value})}
                                    slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                                />

                                <Divider sx={{ my: 1 }} />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        py: 2, borderRadius: '16px', fontWeight: 800, fontSize: '1rem',
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Опублікувати зараз'}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Container>
            </Fade>
        </Box>
    );
}