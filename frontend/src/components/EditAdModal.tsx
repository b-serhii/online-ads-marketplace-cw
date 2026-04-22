import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Stack,
    Box,
    IconButton,
    MenuItem,
    Typography,
    InputAdornment,
    CircularProgress,
    Divider
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';

const CATEGORIES = [
    "Електроніка",
    "Транспорт",
    "Нерухомість",
    "Робота",
    "Послуги",
    "Дім і сад",
    "Одяг та взуття",
    "Дитячий світ",
    "Спорт і хобі",
    "Тварини"
];
interface EditAdModalProps {
    open: boolean;
    onClose: () => void;
    adData: any;
    onSave: (formData: FormData) => Promise<void>;
}

export default function EditAdModal({ open, onClose, adData, onSave }: EditAdModalProps) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: ''
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (adData && open) {
            setForm({
                title: adData.title || '',
                description: adData.description || '',
                price: adData.price?.toString() || '',
                category: adData.category || CATEGORIES[0]
            });

            // БРОНЕБІЙНА ПЕРЕВІРКА ФОТО (захист від падіння модалки)
            let safeUrls: string[] = [];
            if (Array.isArray(adData.images_urls) && adData.images_urls.length > 0) {
                safeUrls = adData.images_urls;
            } else if (adData.image_url) {
                safeUrls = [adData.image_url];
            }

            setPreviewUrls(safeUrls);
            setSelectedFiles([]);
        }
    }, [adData, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            if (previewUrls.length + newFiles.length > 5) {
                alert("Максимальна кількість фото — 5");
                return;
            }

            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...newPreviews]);
        }
    };

    const removePhoto = (index: number) => {
        const updatedPreviews = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(updatedPreviews);

        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const handleAction = async () => {
        setLoading(true);
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('price', form.price);
        fd.append('category', form.category);

        selectedFiles.forEach(file => {
            fd.append('images', file);
        });

        try {
            await onSave(fd);
            onClose();
        } catch (error) {
            console.error("Помилка при збереженні змін:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 6 } }}
        >
            <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3 }}>
                Редагувати оголошення
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f1f5f9' }}>
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Внесіть зміни в поля нижче. Фотографії можна замінити, додавши нові.
                    </Typography>

                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                            Фотографії ({previewUrls.length}/5)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {previewUrls.map((url, index) => (
                                <Box key={index} sx={{ position: 'relative', width: 85, height: 85 }}>
                                    <img
                                        src={url}
                                        alt="Прев'ю"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => removePhoto(index)}
                                        sx={{
                                            position: 'absolute', top: -6, right: -6,
                                            bgcolor: '#ef4444', color: '#fff',
                                            width: 22, height: 22,
                                            '&:hover': { bgcolor: '#dc2626' }
                                        }}
                                    >
                                        <CloseRoundedIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Box>
                            ))}

                            {previewUrls.length < 5 && (
                                <Box
                                    onClick={() => document.getElementById('edit-photo-input')?.click()}
                                    sx={{
                                        width: 85, height: 85, borderRadius: '12px',
                                        border: '2px dashed #cbd5e1', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#94a3b8',
                                        '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: '#f8fafc' }
                                    }}
                                >
                                    <CloudUploadRoundedIcon />
                                </Box>
                            )}
                        </Box>
                        <input type="file" id="edit-photo-input" hidden multiple accept="image/*" onChange={handleFileChange} />
                    </Box>

                    <Divider />

                    <TextField
                        label="Назва"
                        variant="filled"
                        fullWidth
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                    />

                    <Stack direction="row" spacing={2}>
                        <TextField
                            select label="Категорія"
                            variant="filled"
                            fullWidth
                            value={form.category}
                            onChange={e => setForm({...form, category: e.target.value})}
                            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                        >
                            {CATEGORIES.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Ціна"
                            variant="filled"
                            fullWidth
                            type="number"
                            value={form.price}
                            onChange={e => setForm({...form, price: e.target.value})}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₴</InputAdornment>,
                                sx: { borderRadius: '12px' }
                            }}
                        />
                    </Stack>

                    <TextField
                        label="Опис"
                        variant="filled"
                        multiline
                        rows={4}
                        fullWidth
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        onClick={handleAction}
                        sx={{
                            py: 2,
                            borderRadius: 4,
                            fontWeight: 800,
                            fontSize: '1rem',
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)' }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Зберегти зміни'}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}