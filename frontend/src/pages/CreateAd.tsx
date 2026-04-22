import React, { useState } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box, MenuItem,
    Stack, InputAdornment, CircularProgress, Fade, Divider, IconButton,
    Snackbar, Alert
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CATEGORIES = ["Електроніка", "Транспорт", "Нерухомість", "Робота", "Послуги", "Дім і сад"];

export default function CreateAd() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false); // Стейт для сповіщення

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: CATEGORIES[0]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            if (selectedFiles.length + newFiles.length > 5) {
                alert("Можна додати максимум 5 фотографій");
                return;
            }

            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);

            const updatedPreviews = updatedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(updatedPreviews);
        }
    };

    const removePhoto = (indexToRemove: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = updatedFiles.map(file => URL.createObjectURL(file));

        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('price', form.price);
        fd.append('category', form.category);

        selectedFiles.forEach((file) => {
            fd.append('images', file);
        });

        try {
            await api.post('/ads/', fd);
            setSuccessOpen(true);

            setTimeout(() => {
                navigate('/my-ads');
            }, 2000);
        } catch (error) {
            console.error("Помилка публікації:", error);
            alert("Помилка при створенні оголошення. Перевірте з'єднання з бекендом.");
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
                            Завантажте до 5 фото. Перше фото буде головним.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Box>
                                    <Box
                                        sx={{
                                            width: '100%', height: 240, borderRadius: 6, bgcolor: '#f1f5f9',
                                            border: '2px dashed #cbd5e1', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', overflow: 'hidden', transition: '0.3s',
                                            position: 'relative',
                                            '&:hover': { borderColor: '#6366f1', bgcolor: '#f8fafc' }
                                        }}
                                        onClick={() => { if(previewUrls.length === 0) document.getElementById('ad-files')?.click() }}
                                    >
                                        {previewUrls.length > 0 ? (
                                            <>
                                                <img src={previewUrls[0]} alt="Головне" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <IconButton
                                                    onClick={(e) => { e.stopPropagation(); removePhoto(0); }}
                                                    sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(239, 68, 68, 0.9)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}
                                                >
                                                    <CloseRoundedIcon fontSize="small" />
                                                </IconButton>
                                                <Box sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: 'rgba(15, 23, 42, 0.7)', color: '#fff', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 700 }}>
                                                    Головне фото
                                                </Box>
                                            </>
                                        ) : (
                                            <Stack alignItems="center" sx={{ color: '#64748b' }}>
                                                <AddPhotoAlternateIcon sx={{ fontSize: 48, mb: 1 }} />
                                                <Typography variant="button" sx={{ fontWeight: 700 }}>Додати фотографії</Typography>
                                            </Stack>
                                        )}
                                    </Box>

                                    {previewUrls.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                                            {previewUrls.slice(1).map((url, index) => (
                                                <Box key={index + 1} sx={{ position: 'relative', width: 80, height: 80 }}>
                                                    <img src={url} alt="Додаткове" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removePhoto(index + 1)}
                                                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#ef4444', color: '#fff', width: 22, height: 22, '&:hover': { bgcolor: '#dc2626' } }}
                                                    >
                                                        <CloseRoundedIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            ))}

                                            {previewUrls.length < 5 && (
                                                <Box
                                                    onClick={() => document.getElementById('ad-files')?.click()}
                                                    sx={{
                                                        width: 80, height: 80, borderRadius: '12px', border: '2px dashed #cbd5e1',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                        color: '#94a3b8', '&:hover': { borderColor: '#6366f1', color: '#6366f1' }
                                                    }}
                                                >
                                                    <CloudUploadRoundedIcon />
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <input type="file" id="ad-files" hidden multiple accept="image/*" onChange={handleFileChange} />

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
                                    disabled={loading || selectedFiles.length === 0}
                                    sx={{
                                        py: 2, borderRadius: '16px', fontWeight: 800, fontSize: '1rem',
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Опублікувати оголошення'}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Container>
            </Fade>

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}>
                    Оголошення успішно опубліковано! 🎉
                </Alert>
            </Snackbar>
        </Box>
    );
}