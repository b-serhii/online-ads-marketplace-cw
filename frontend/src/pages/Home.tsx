import React, { useEffect, useState } from "react";
import {
    Container, Typography, Box, Button, CircularProgress, Fade, Stack,
    TextField, InputAdornment, Drawer, IconButton, Select, MenuItem,
    FormControl, InputLabel, Chip, Divider, useMediaQuery, useTheme
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AdCard from "../components/AdCard";
import { api } from "../services/api";
import "../App.css";

const categories = ["Всі", "Електроніка", "Транспорт", "Нерухомість", "Робота", "Послуги", "Дім і сад"];
const conditions = ["Всі", "Нове", "Вживане"];

const Home: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Стани фільтрів
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Всі");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [condition, setCondition] = useState("Всі");
    const [sortBy, setSortBy] = useState("newest"); // newest, price_asc, price_desc

    // Стан мобільного меню фільтрів
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const response = await api.get("/ads/");
            setAds(response.data);
        } catch (error) {
            console.error("Помилка завантаження оголошень:", error);
        } finally {
            setLoading(false);
        }
    };

    // Логіка фільтрації та сортування
    let filteredAds = ads.filter(ad => {
        const matchesCategory = selectedCategory === "Всі" || ad.category === selectedCategory;
        const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             ad.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const adPrice = Number(ad.price) || 0;
        const min = priceMin ? Number(priceMin) : 0;
        const max = priceMax ? Number(priceMax) : Infinity;
        const matchesPrice = adPrice >= min && adPrice <= max;

        // Якщо в бекенді є поле condition, фільтруємо по ньому (припускаємо, що воно є)
        const matchesCondition = condition === "Всі" || ad.condition === condition || !ad.condition;

        return matchesCategory && matchesSearch && matchesPrice && matchesCondition;
    });

    // Сортування
    if (sortBy === "price_asc") {
        filteredAds.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price_desc") {
        filteredAds.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else {
        // За замовчуванням (найновіші) - припускаємо, що бекенд вже віддає нові першими,
        // або можна додати сортування по ID/даті
        filteredAds.sort((a, b) => b.id - a.id);
    }

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("Всі");
        setPriceMin("");
        setPriceMax("");
        setCondition("Всі");
        setSortBy("newest");
    };

    // Компонент панелі фільтрів (щоб не дублювати код для мобілки і ПК)
    const FilterContent = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', mb: 1.5, letterSpacing: 1 }}>
                    Категорія
                </Typography>
                <Stack spacing={0.5}>
                    {categories.map((cat) => (
                        <Box
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                if (isMobile) setMobileFiltersOpen(false);
                            }}
                            sx={{
                                px: 2, py: 1.2,
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                bgcolor: selectedCategory === cat ? '#eff6ff' : 'transparent',
                                color: selectedCategory === cat ? '#2563eb' : '#475569',
                                fontWeight: selectedCategory === cat ? 700 : 500,
                                '&:hover': { bgcolor: selectedCategory === cat ? '#eff6ff' : '#f8fafc' }
                            }}
                        >
                            {cat}
                        </Box>
                    ))}
                </Stack>
            </Box>

            <Divider />

            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', mb: 2, letterSpacing: 1 }}>
                    Ціна (₴)
                </Typography>
                <Box display="flex" gap={1.5} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Від"
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        sx={{ bgcolor: '#f8fafc', borderRadius: 1 }}
                    />
                    <Typography color="textSecondary">-</Typography>
                    <TextField
                        size="small"
                        placeholder="До"
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        sx={{ bgcolor: '#f8fafc', borderRadius: 1 }}
                    />
                </Box>
            </Box>

            <Divider />

            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', mb: 2, letterSpacing: 1 }}>
                    Стан
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {conditions.map(cond => (
                        <Chip
                            key={cond}
                            label={cond}
                            onClick={() => setCondition(cond)}
                            color={condition === cond ? "primary" : "default"}
                            variant={condition === cond ? "filled" : "outlined"}
                            sx={{ fontWeight: 600, borderRadius: '8px' }}
                        />
                    ))}
                </Stack>
            </Box>

            <Button variant="outlined" fullWidth onClick={resetFilters} sx={{ mt: 2, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                Скинути всі фільтри
            </Button>
        </Box>
    );

    return (
        <Box className="page-container" sx={{ bgcolor: '#f4f5f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Головний контейнер (максимальна ширина з розумними відступами) */}
            <Container maxWidth="xl" sx={{ flexGrow: 1, mt: { xs: 3, md: 5 }, pb: 8, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>

                {/* Макро-лейаут на Flexbox (уникаємо помилок Grid) */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>

                    {/* ЛІВА КОЛОНКА (Сайдбар для ПК) */}
                    {!isMobile && (
                        <Box sx={{
                            width: '280px',
                            flexShrink: 0,
                            position: 'sticky',
                            top: '24px',
                            bgcolor: '#fff',
                            p: 3,
                            borderRadius: 4,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <FilterContent />
                        </Box>
                    )}

                    {/* ПРАВА КОЛОНКА (Контент) */}
                    <Box sx={{ flexGrow: 1, width: '100%' }}>

                        {/* Верхня панель управління */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'stretch', sm: 'center' },
                            gap: 2,
                            mb: 4,
                            bgcolor: '#fff',
                            p: { xs: 2, sm: 2.5 },
                            borderRadius: 4,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    {searchQuery ? `Результати для "${searchQuery}"` : selectedCategory}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                                    Знайдено оголошень: <Box component="span" sx={{ color: '#2563eb', fontWeight: 700 }}>{filteredAds.length}</Box>
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                {/* Кнопка фільтрів для мобільних */}
                                {isMobile && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<TuneIcon />}
                                        onClick={() => setMobileFiltersOpen(true)}
                                        sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#cbd5e1', color: '#475569', fontWeight: 600, flexGrow: 1 }}
                                    >
                                        Фільтри
                                    </Button>
                                )}

                                {/* Сортування */}
                                <FormControl size="small" sx={{ minWidth: 180, flexGrow: isMobile ? 1 : 0 }}>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        displayEmpty
                                        sx={{ borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' }, fontWeight: 600, color: '#334155' }}
                                        startAdornment={<InputAdornment position="start"><SortIcon fontSize="small"/></InputAdornment>}
                                    >
                                        <MenuItem value="newest">Найновіші</MenuItem>
                                        <MenuItem value="price_asc">Від дешевих</MenuItem>
                                        <MenuItem value="price_desc">Від дорогих</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Сітка оголошень (CSS Grid - завжди ідеально адаптивна) */}
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}>
                                <CircularProgress thickness={4} size={50} sx={{ color: '#2563eb' }} />
                            </Box>
                        ) : (
                            <Fade in timeout={500}>
                                <Box sx={{ width: '100%' }}>
                                    {filteredAds.length > 0 ? (
                                        <Box sx={{
                                            display: 'grid',
                                            // Магія адаптивності: картки самі підлаштовуються від 260px до 1fr
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                            gap: 3
                                        }}>
                                            {filteredAds.map((ad) => (
                                                <AdCard key={ad.id} ad={ad} />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box sx={{
                                            textAlign: 'center', py: 12, bgcolor: '#fff', borderRadius: 4, border: '1px dashed #cbd5e1'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#64748b', mb: 2 }}>
                                                Оголошень не знайдено 😕
                                            </Typography>
                                            <Button variant="contained" disableElevation onClick={resetFilters} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#2563eb', fontWeight: 600 }}>
                                                Скинути фільтри
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Fade>
                        )}
                    </Box>

                </Box>
            </Container>

            {/* Мобільне меню фільтрів (Drawer) */}
            <Drawer
                anchor="left"
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                PaperProps={{ sx: { width: '100%', maxWidth: '320px', p: 3, bgcolor: '#fff' } }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Фільтри</Typography>
                    <IconButton onClick={() => setMobileFiltersOpen(false)} sx={{ bgcolor: '#f1f5f9' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <FilterContent />
            </Drawer>
        </Box>
    );
};

export default Home;