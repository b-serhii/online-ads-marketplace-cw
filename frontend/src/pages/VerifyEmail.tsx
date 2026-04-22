import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { verifyEmail } from '../services/auth';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const hasRequested = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Токен не знайдено в посиланні.');
            return;
        }

        if (hasRequested.current) return;
        hasRequested.current = true;

        verifyEmail(token)
            .then((res) => {
                setStatus('success');
                setMessage(res.message || 'Електронну пошту успішно підтверджено!');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.detail || 'Помилка підтвердження або токен вже використано.');
            });
    }, [token]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f5f8' }}>
            <Paper sx={{ p: 5, borderRadius: 4, textAlign: 'center', maxWidth: 400, width: '100%' }}>
                {status === 'loading' && (
                    <>
                        <CircularProgress size={60} sx={{ color: '#2563eb', mb: 3 }} />
                        <Typography variant="h6" fontWeight={600}>Перевірка даних...</Typography>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
                        <Typography variant="h5" fontWeight={800} color="#0f172a" mb={1}>Успіх!</Typography>
                        <Typography color="text.secondary" mb={4}>{message}</Typography>
                        <Button component={Link} to="/login" variant="contained" fullWidth sx={{ py: 1.5, borderRadius: 2, bgcolor: '#2563eb' }}>
                            Перейти до входу
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ef4444', mb: 2 }} />
                        <Typography variant="h5" fontWeight={800} color="#0f172a" mb={1}>Упс!</Typography>
                        <Typography color="text.secondary" mb={4}>{message}</Typography>
                        <Button component={Link} to="/login" variant="outlined" fullWidth sx={{ py: 1.5, borderRadius: 2 }}>
                            Повернутися назад
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}