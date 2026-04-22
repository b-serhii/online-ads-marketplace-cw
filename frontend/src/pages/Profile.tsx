import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Avatar, Container,
    CircularProgress, Alert, Snackbar, Stack, IconButton, Badge, Chip,
    Fade, InputAdornment, Grid, Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhoneIcon from '@mui/icons-material/Phone';

import type { MeResponse } from '../services/auth';
import { me, updateProfile } from '../services/auth';

export default function Profile() {
    const [user, setUser] = useState<MeResponse | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        (async () => {
            try {
                const data = await me();
                setUser(data);
                setName(data.name || '');
                setPhone(data.phone || '');
                if (data.avatar) {
                    setAvatarUrl(data.avatar.startsWith('http') ? data.avatar : `${BACKEND_URL}${data.avatar}`);
                }
            } catch {
                setToast({ open: true, message: 'Помилка завантаження', severity: 'error' });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return setToast({ open: true, message: "Ім'я обов'язкове", severity: 'error' });
        setSaving(true);

        const fd = new FormData();
        fd.append('name', name);
        fd.append('phone', phone);
        if (selectedFile) fd.append('file', selectedFile);

        try {
            const updated = await updateProfile(fd);
            setUser(updated);
            setToast({ open: true, message: 'Профіль оновлено!', severity: 'success' });
            setTimeout(() => window.location.reload(), 800);
        } catch {
            setToast({ open: true, message: 'Помилка збереження', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress thickness={2} size={60} sx={{ color: '#6366f1' }} />
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: { xs: 4, md: 8 } }}>
            <Fade in timeout={800}>
                <Container maxWidth="lg">

                    <Button
                        component={Link}
                        to="/home"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 4, textTransform: 'none', fontWeight: 600, color: '#64748b' }}
                    >
                        На головну
                    </Button>

                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper sx={{
                                p: 4, borderRadius: 8, textAlign: 'center',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                                border: '1px solid #f1f5f9',
                                background: '#fff'
                            }}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <IconButton
                                            onClick={() => fileInputRef.current?.click()}
                                            sx={{
                                                bgcolor: '#6366f1', color: '#fff',
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                                                '&:hover': { bgcolor: '#4f46e5' }
                                            }}
                                        >
                                            <PhotoCamera sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    }
                                >
                                    <Avatar
                                        src={avatarUrl || undefined}
                                        sx={{
                                            width: 180, height: 180, mx: 'auto',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                            fontSize: 60, bgcolor: '#f0f4ff', color: '#6366f1',
                                            border: '6px solid #fff'
                                        }}
                                    >
                                        {String(user?.name || "U").charAt(0).toUpperCase()}
                                    </Avatar>
                                </Badge>
                                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />

                                <Typography variant="h5" sx={{ mt: 3, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                                    {user?.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                                    {user?.email}
                                </Typography>

                                <Stack spacing={1.5}>
                                    {user?.is_admin && (
                                        <Chip
                                            icon={<AdminPanelSettingsIcon style={{ color: '#fff' }} />}
                                            label="Адміністратор"
                                            sx={{ bgcolor: '#1e293b', color: '#fff', fontWeight: 700, borderRadius: 3, py: 2.5 }}
                                        />
                                    )}
                                    <Chip
                                        icon={<VerifiedUserIcon />}
                                        label={user?.is_email_verified ? "Верифікований" : "Не верифікований"}
                                        variant="outlined"
                                        color={user?.is_email_verified ? "success" : "default"}
                                        sx={{ fontWeight: 700, borderRadius: 3, py: 2.5 }}
                                    />
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Paper sx={{
                                p: { xs: 4, md: 6 }, borderRadius: 8,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                                border: '1px solid #f1f5f9',
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>
                                    Налаштування профілю
                                </Typography>

                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block' }}>
                                            Публічне ім'я
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineIcon sx={{ color: '#6366f1' }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: 4, bgcolor: '#f8fafc' }
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block' }}>
                                            Номер телефону
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+380..."
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIcon sx={{ color: '#6366f1' }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: 4, bgcolor: '#f8fafc' }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block' }}>
                                            Електронна пошта
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={user?.email || ''}
                                            disabled
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <MailOutlineIcon />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: 4, bgcolor: '#f1f5f9' }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSave}
                                            disabled={saving}
                                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                            sx={{
                                                px: 6, py: 1.8, borderRadius: 4, fontWeight: 700, textTransform: 'none',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.4)' },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {saving ? 'Збереження...' : 'Зберегти зміни'}
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper sx={{
                                mt: 4, p: 4, borderRadius: 8, bgcolor: '#fff', border: '1px solid #fee2e2',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.05)'
                            }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#991b1b' }}>
                                        Небезпечна зона
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#b91c1c' }}>
                                        Видалення акаунту призведе до повної втрати ваших даних.
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteOutlineIcon />}
                                    sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none' }}
                                >
                                    Видалити
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Fade>
            <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
                <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: 4, fontWeight: 600 }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
