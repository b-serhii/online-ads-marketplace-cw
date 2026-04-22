import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, Stack, IconButton, MenuItem, Select, FormControl } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';

interface EditAdModalProps {
    open: boolean;
    onClose: () => void;
    adData: any;
    onSave: (formData: FormData) => void;
}

export default function EditAdModal({ open, onClose, adData, onSave }: EditAdModalProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Всі");

    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (adData && open) {
            setTitle(adData.title || "");
            setPrice(adData.price || "");
            setDescription(adData.description || "");
            setCategory(adData.category || "Всі");
            setNewPhotos([]);
            setPreviewUrls(adData.images || []);
        }
    }, [adData, open]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            if (newPhotos.length + filesArray.length > 5) {
                alert("Можна додати максимум 5 фото!");
                return;
            }

            setNewPhotos((prev) => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const removePhoto = (indexToRemove: number) => {
        setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
        setNewPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);

        newPhotos.forEach((file) => {
            formData.append("images", file); // Назва 'images' має збігатися з тим, що очікує FastAPI
        });

        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
                Редагувати оголошення
                <IconButton onClick={onClose} sx={{ bgcolor: '#f1f5f9' }}><CloseRoundedIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        label="Назва товару"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />

                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Ціна (₴)"
                            type="number"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <FormControl fullWidth>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="Всі">Виберіть категорію</MenuItem>
                                <MenuItem value="Електроніка">Електроніка</MenuItem>
                                <MenuItem value="Транспорт">Транспорт</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    <TextField
                        label="Опис"
                        multiline
                        rows={4}
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />

                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} mb={1}>Фотографії (до 5 шт.)</Typography>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {/* Прев'ю фотографій */}
                            {previewUrls.map((url, index) => (
                                <Box key={index} sx={{ position: 'relative', width: 80, height: 80 }}>
                                    <img
                                        src={url}
                                        alt={`preview-${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => removePhoto(index)}
                                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#ef4444', color: '#fff', '&:hover': { bgcolor: '#dc2626' }, width: 24, height: 24 }}
                                    >
                                        <CloseRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            ))}

                            {previewUrls.length < 5 && (
                                <Button
                                    component="label"
                                    sx={{
                                        width: 80, height: 80, borderRadius: '12px', border: '2px dashed #cbd5e1',
                                        display: 'flex', flexDirection: 'column', color: '#64748b'
                                    }}
                                >
                                    <CloudUploadRoundedIcon />
                                    <input type="file" hidden multiple accept="image/*" onChange={handlePhotoChange} />
                                </Button>
                            )}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        sx={{
                            borderRadius: '14px', py: 1.5, fontWeight: 800, mt: 2, textTransform: 'none',
                            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        Зберегти зміни
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}