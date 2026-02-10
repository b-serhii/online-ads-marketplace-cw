import React from "react";
import { Container, Typography, Box, Chip, Button } from "@mui/material";
import { Grid } from "@mui/material";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AdCard from "../components/AdCard";

const categories = ["Всі", "Електроніка", "Транспорт", "Нерухомість", "Робота", "Послуги", "Дім і сад"];

const dummyAds = [
    { id: 1, title: "iPhone 15 Pro Max", price: "45 000 грн", category: "Електроніка", location: "Київ" },
    { id: 2, title: "MacBook Air M2", price: "38 500 грн", category: "Електроніка", location: "Львів" },
    { id: 3, title: "Гірський велосипед", price: "12 000 грн", category: "Транспорт", location: "Одеса" },
    { id: 4, title: "Sony Headphones", price: "5 000 грн", category: "Електроніка", location: "Дніпро" },
    { id: 5, title: "Диван кутовий", price: "15 000 грн", category: "Дім і сад", location: "Харків" },
    { id: 6, title: "Послуги репетитора", price: "300 грн/год", category: "Послуги", location: "Онлайн" },
];

const Home: React.FC = () => {
    return (
        <Box className="page-container">
            <Navbar />
            <HeroSection />

            <Container maxWidth="lg">
                <Box mb={5}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Категорії
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {categories.map((cat, index) => (
                            <Chip
                                key={index}
                                label={cat}
                                clickable
                                color={index === 0 ? "primary" : "default"}
                                sx={{ fontSize: '1rem', p: 1 }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                        Свіжі оголошення
                    </Typography>
                    <Button color="primary">Дивитись всі</Button>
                </Box>

                <Grid container spacing={3}>
                    {dummyAds.map((ad) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ad.id}>
                            <AdCard
                                title={ad.title}
                                price={ad.price}
                                category={ad.category}
                                location={ad.location}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;