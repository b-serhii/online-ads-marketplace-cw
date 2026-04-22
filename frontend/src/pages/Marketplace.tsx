import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, CircularProgress,
    Button, Paper, TextField, InputAdornment, MenuItem,
    List, ListItem, ListItemButton, ListItemText, Stack, Divider,
    FormControlLabel, Switch, RadioGroup, Radio, FormControl
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import { api } from '../services/api';

const CATEGORIES = [
    "Всі", "Електроніка", "Транспорт", "Нерухомість",
    "Робота", "Послуги", "Дім і сад", "Одяг та взуття",
    "Дитячий світ", "Спорт і хобі", "Тварини"
];

interface Ad {
    id: number;
    title: string;
    price: number;
    category: string;
    image_url: string | null;
    images_urls?: string[];
    description: string;
    created_at: string;
    condition?: string; // На майбутнє, якщо додамо в базу
}

export default function Marketplace() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    // Стейт фільтрів
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Всі');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
    const [condition, setCondition] = useState('Всі');

    // Стейт для мобільного меню фільтрів
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await api.get('/ads/');
                setAds(response.data);
                setFilteredAds(response.data);
            } catch (err) {
                console.error('Помилка завантаження оголошень', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        let result = [...ads];

        if (searchQuery.trim() !== '') {
            result = result.filter(ad =>
                ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ad.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'Всі') {
            result = result.filter(ad => ad.category === selectedCategory);
        }

        if (minPrice !== '') {
            result = result.filter(ad => ad.price >= Number(minPrice));
        }
        if (maxPrice !== '') {
            result = result.filter(ad => ad.price <= Number(maxPrice));
        }

        if (onlyWithPhoto) {
            result = result.filter(ad => ad.image_url || (ad.images_urls && ad.images_urls.length > 0));
        }

        if (condition !== 'Всі') {
            result = result.filter(ad => !ad.condition || ad.condition === condition);
        }

        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortBy === 'price_asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredAds(result);
    }, [ads, searchQuery, selectedCategory, minPrice, maxPrice, sortBy, onlyWithPhoto, condition]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('Всі');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('newest');
        setOnlyWithPhoto(false);
        setCondition('Всі');
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Navbar />
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress sx={{ color: '#6366f1' }} />
            </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10 }}>
            <Navbar />

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Кнопка фільтрів для мобілок */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<FilterListRoundedIcon />}
                        onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                        sx={{ borderRadius: 3, py: 1.5, bgcolor: '#0f172a' }}
                    >
                        {showFiltersMobile ? 'Приховати фільтри' : 'Показати фільтри'}
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    alignItems: 'flex-start'
                }}>

                    {/* ЛІВА ПАНЕЛЬ: САЙДБАР */}
                    <Box sx={{
                        width: { xs: '100%', md: 280, lg: 300 },
                        flexShrink: 0,
                        position: { md: 'sticky' },
                        top: 24,
                        display: { xs: showFiltersMobile ? 'block' : 'none', md: 'block' }
                    }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                                Фільтри
                            </Typography>

                            {/* Категорії */}
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Категорія
                            </Typography>
                            <List sx={{ mt: 1, mb: 2, p: 0, maxHeight: 280, overflowY: 'auto' }}>
                                {CATEGORIES.map((cat) => (
                                    <ListItem key={cat} disablePadding sx={{ mb: 0.5 }}>
                                        <ListItemButton
                                            onClick={() => setSelectedCategory(cat)}
                                            sx={{
                                                borderRadius: 2, py: 0.5,
                                                bgcolor: selectedCategory === cat ? '#eff6ff' : 'transparent',
                                                color: selectedCategory === cat ? '#6366f1' : '#475569',
                                                '&:hover': { bgcolor: selectedCategory === cat ? '#eff6ff' : '#f8fafc' }
                                            }}
                                        >
                                            <ListItemText primary={cat} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedCategory === cat ? 800 : 500 }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            {/* Ціна */}
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>
                                Ціна (₴)
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                <TextField
                                    size="small" placeholder="Від" type="number"
                                    value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                                    InputProps={{ sx: { borderRadius: 2, fontSize: '0.9rem' } }}
                                />
                                <TextField
                                    size="small" placeholder="До" type="number"
                                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                    InputProps={{ sx: { borderRadius: 2, fontSize: '0.9rem' } }}
                                />
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>
                                Додатково
                            </Typography>
                            <FormControlLabel
                                control={<Switch checked={onlyWithPhoto} onChange={(e) => setOnlyWithPhoto(e.target.checked)} color="primary" />}
                                label={<Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Тільки з фото</Typography>}
                                sx={{ mb: 2, ml: 0 }}
                            />

                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>
                                Стан товару
                            </Typography>
                            <FormControl component="fieldset" sx={{ mb: 3, w: '100%' }}>
                                <RadioGroup value={condition} onChange={(e) => setCondition(e.target.value)}>
                                    <FormControlLabel value="Всі" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.9rem' }}>Будь-який</Typography>} />
                                    <FormControlLabel value="Новий" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.9rem' }}>Новий</Typography>} />
                                    <FormControlLabel value="Вживаний" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.9rem' }}>Вживаний</Typography>} />
                                </RadioGroup>
                            </FormControl>

                            <Button
                                fullWidth variant="outlined" onClick={handleResetFilters}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b' }}
                            >
                                Скинути всі фільтри
                            </Button>
                        </Paper>
                    </Box>

                    {/* ПРАВА ПАНЕЛЬ: ПОШУК І ТОВАРИ */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>

                        {/* Пошук */}
                        <TextField
                            fullWidth
                            placeholder="Що ви шукаєте?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                mb: 4, bgcolor: '#fff', borderRadius: 3,
                                '& .MuiOutlinedInput-root': { borderRadius: 3, pr: 1 },
                                '& fieldset': { borderColor: '#e2e8f0' },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                {selectedCategory === 'Всі' ? `Всі оголошення (${filteredAds.length})` : `${selectedCategory} (${filteredAds.length})`}
                            </Typography>

                            <TextField
                                select size="small" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                sx={{ minWidth: 180, bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="newest">Найновіші</MenuItem>
                                <MenuItem value="price_asc">Від дешевих до дорогих</MenuItem>
                                <MenuItem value="price_desc">Від дорогих до дешевих</MenuItem>
                            </TextField>
                        </Box>

                        {filteredAds.length === 0 ? (
                            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, bgcolor: '#fff', border: '1px dashed #cbd5e1' }}>
                                <Typography variant="h6" color="text.secondary">
                                    За вашими критеріями нічого не знайдено 😕
                                </Typography>
                                <Button onClick={handleResetFilters} sx={{ mt: 2, textTransform: 'none', fontWeight: 700 }}>
                                    Очистити фільтри
                                </Button>
                            </Paper>
                        ) : (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                gap: 3
                            }}>
                                {filteredAds.map((ad) => (
                                    <AdCard key={ad.id} ad={ad} />
                                ))}
                            </Box>
                        )}
                    </Box>

                </Box>
            </Container>
        </Box>
    );
}