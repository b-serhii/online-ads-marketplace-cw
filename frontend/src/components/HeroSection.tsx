import React from 'react';
import { Box, Container, Typography, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface HeroSectionProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <Box className="hero-section">
            <div className="hero-glow"></div> {/* Фонове світіння */}

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                <Typography variant="h2" sx={{
                    fontWeight: 700,
                    color: '#1d1d1f',
                    letterSpacing: '-1px',
                    mb: 1
                }}>
                    Знайди своє.
                </Typography>

                <Typography variant="h2" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #0071e3 0%, #00c6ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-1px',
                    mb: 3
                }}>
                    Швидко та просто.
                </Typography>

                <Typography variant="body1" sx={{ color: '#86868b', fontSize: '1.2rem', maxWidth: '500px', mx: 'auto' }}>
                    Найкраще місце для купівлі та продажу речей.
                    Без зайвого шуму.
                </Typography>

                <Box className="search-bar-container">
                    <SearchIcon sx={{ color: '#86868b', ml: 1.5, mr: 1 }} />
                    <TextField
                        fullWidth
                        placeholder="Пошук оголошень"
                        variant="standard"
                        value={searchQuery} // Прив'язка до стану
                        onChange={(e) => setSearchQuery(e.target.value)} // Оновлення стану при вводі
                        InputProps={{
                            disableUnderline: true,
                            style: { fontSize: '16px', color: '#1d1d1f' }
                        }}
                    />
                    <IconButton sx={{
                        bgcolor: '#0071e3',
                        color: 'white',
                        p: 1,
                        mr: 0.5,
                        '&:hover': { bgcolor: '#005bb5' }
                    }}>
                        <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;