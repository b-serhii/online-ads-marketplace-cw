import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Button, CircularProgress, Stack,
    TextField, Select, MenuItem, useMediaQuery, useTheme, Paper
} from "@mui/material";
// В MUI v6 Grid імпортується так само, але працює як Grid2
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdCard from "../components/AdCard";
import { api } from "../services/api";

const categories = ["Всі", "Електроніка", "Транспорт", "Нерухомість", "Робота", "Послуги", "Дім і сад"];

const Marketplace = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Всі");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
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
        fetchAds();
    }, []);

    const filteredAds = ads.filter(ad => {
        const matchesCategory = selectedCategory === "Всі" || ad.category === selectedCategory;
        const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ad.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const adPrice = Number(ad.price) || 0;
        const min = priceMin ? Number(priceMin) : 0;
        const max = priceMax ? Number(priceMax) : Infinity;
        return matchesCategory && matchesSearch && adPrice >= min && adPrice <= max;
    });

    const sortedAds = [...filteredAds].sort((a, b) => {
        if (sortBy === "price_asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price_desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        return b.id - a.id;
    });

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e2e8f0', py: 3 }}>
                <Container maxWidth="lg">
                    <TextField
                        fullWidth
                        placeholder="Що ви шукаєте?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />,
                                sx: { borderRadius: 4, bgcolor: '#f1f5f9', '& fieldset': { border: 'none' } }
                            }
                        }}
                    />
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4, pb: 8, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>

                    {!isMobile && (
                        <Box sx={{ width: { md: '280px' }, flexShrink: 0 }}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', position: 'sticky', top: 20 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Фільтри</Typography>
                                <Stack spacing={0.5}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', mb: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        Категорія
                                    </Typography>
                                    {categories.map((cat) => (
                                        <Box
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            sx={{
                                                px: 2, py: 1, borderRadius: 2, cursor: 'pointer',
                                                bgcolor: selectedCategory === cat ? '#eff6ff' : 'transparent',
                                                color: selectedCategory === cat ? '#2563eb' : '#475569',
                                                fontWeight: selectedCategory === cat ? 700 : 500,
                                                '&:hover': { bgcolor: '#f1f5f9' }
                                            }}
                                        >
                                            {cat}
                                        </Box>
                                    ))}
                                </Stack>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {setPriceMin(""); setPriceMax(""); setSelectedCategory("Всі"); setSearchQuery("");}}
                                    sx={{ mt: 3, borderRadius: 2, textTransform: 'none' }}
                                >
                                    Скинути
                                </Button>
                            </Paper>
                        </Box>
                    )}

                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {selectedCategory} ({sortedAds.length})
                            </Typography>

                            <Select
                                size="small"
                                value={sortBy}
                                onChange={(e) => setSortBy(String(e.target.value))}
                                sx={{ borderRadius: 2, bgcolor: '#fff', minWidth: 150 }}
                            >
                                <MenuItem value="newest">Найновіші</MenuItem>
                                <MenuItem value="price_asc">Дешевші</MenuItem>
                                <MenuItem value="price_desc">Дорожчі</MenuItem>
                            </Select>
                        </Box>

                        {loading ? (
                            <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
                        ) : (
                            /* НОВИЙ СИНТАКСИС ГРІД v6 */
                            <Grid container spacing={2}>
                                {sortedAds.map(ad => (
                                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={ad.id}>
                                        <AdCard ad={ad} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Box>
            </Container>

            <Footer />
        </Box>
    );
};

export default Marketplace;