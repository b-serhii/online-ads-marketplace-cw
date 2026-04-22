import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";

interface AdCardProps {
    ad: {
        id: number;
        title: string;
        price: number;
        category: string;
        image_url: string | null;
        description: string;
    };
}

const BACKEND_URL = 'http://localhost:8000';

export default function AdCard({ ad }: AdCardProps) {
    const navigate = useNavigate();

    const imageUrl = ad.image_url
        ? (ad.image_url.startsWith('http') ? ad.image_url : `${BACKEND_URL}${ad.image_url}`)
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <Card
            onClick={() => navigate(`/ad/${ad.id}`)}
            sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-5px)' }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={ad.title}
                sx={{ objectFit: 'cover' }}
            />

            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip label={ad.category} size="small" sx={{ fontWeight: 600, bgcolor: '#f1f5f9' }} />
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                        {ad.price} ₴
                    </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, height: '1.5em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ad.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                    {ad.description}
                </Typography>
            </CardContent>
        </Card>
    );
}