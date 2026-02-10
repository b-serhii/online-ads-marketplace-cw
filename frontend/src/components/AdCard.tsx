import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';

interface AdProps {
    title: string;
    price: string;
    category: string;
    image?: string;
    location: string;
}

const AdCard: React.FC<AdProps> = ({ title, price, category, image, location }) => {
    return (
        <Card className="ad-card">
            {/* Картинка */}
            <Box sx={{ position: 'relative', height: 240, bgcolor: '#f5f5f7' }}>
                {image ? (
                    <CardMedia component="img" height="100%" image={image} alt={title} sx={{ objectFit: 'cover' }} />
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <Typography variant="caption" sx={{ color: '#86868b' }}>No Preview</Typography>
                    </Box>
                )}

                <Chip
                    label={category}
                    size="small"
                    className="category-chip"
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                />
            </Box>

            {/* Контент */}
            <CardContent sx={{ pt: 3, pb: 3, px: 3 }}>
                <Typography variant="caption" sx={{ color: '#86868b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {location}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, mb: 0.5, color: '#1d1d1f' }} noWrap>
                    {title}
                </Typography>

                <Typography variant="body1" sx={{ color: '#0071e3', fontWeight: 600 }}>
                    {price}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AdCard;