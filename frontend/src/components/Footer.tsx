import { Box, Container, Typography, Link, Stack, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: '#fff', pt: 8, pb: 4, borderTop: '1px solid #f1f5f9', mt: 'auto' }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'grid',
                    gap: 4,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '2fr 1fr 1fr 2fr'
                    },
                    mb: 4
                }}>

                    {/* Секція бренду */}
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366f1', mb: 2 }}>
                            Online Ads
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 280, lineHeight: 1.6 }}>
                            Найкраще місце для купівлі та продажу речей. Швидко, безпечно та без зайвого шуму.
                        </Typography>
                    </Box>

                    {/* Секція посилань 1 */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            Сервіс
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link href="/marketplace" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#6366f1' } }}>Оголошення</Link>
                            <Link href="/pricing" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#6366f1' } }}>Тарифи</Link>
                        </Stack>
                    </Box>

                    {/* Секція посилань 2 */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            Підтримка
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link href="#" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#6366f1' } }}>FAQ</Link>
                            <Link href="#" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#6366f1' } }}>Допомога</Link>
                        </Stack>
                    </Box>

                    {/* Соцмережі */}
                    <Box sx={{ textAlign: { md: 'right' } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            Ми в соцмережах
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            <IconButton size="small" sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#eff6ff', color: '#6366f1' } }}>
                                <InstagramIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#eff6ff', color: '#6366f1' } }}>
                                <TelegramIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#eff6ff', color: '#6366f1' } }}>
                                <LinkedInIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9' }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                    gap: 2
                }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        © 2026 Online Ads Marketplace. Всі права захищені.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        Створено з любов'ю до коду.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}