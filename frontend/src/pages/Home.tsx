import { Box, Container, Typography, Button, Stack, Paper, Chip, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Іконки
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EastIcon from '@mui/icons-material/East';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import UnlimitedIcon from '@mui/icons-material/AllInclusive';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SearchIcon from '@mui/icons-material/Search';

const fadeInUp: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } },
};

const staggerContainer: Variants = {
    animate: { transition: { staggerChildren: 0.15 } },
};

const features = [
    { icon: <TrendingUpIcon />, title: "Premium Буст", desc: "Підніміть оголошення в топ та отримайте в 15 разів більше переглядів за добу.", color: "#6366f1" },
    { icon: <VerifiedUserIcon />, title: "Безпечні угоди", desc: "Кожен акаунт проходить верифікацію через Email. Купуйте впевнено.", color: "#10b981" },
    { icon: <RocketLaunchIcon />, title: "Миттєва публікація", desc: "Ваш товар з'являється в мережі за лічені секунди завдяки Cloudinary.", color: "#f59e0b" },
    { icon: <SearchIcon />, title: "Розумний пошук", desc: "Фільтруйте за ціною, категорією та станом, щоб знайти саме те.", color: "#ec4899" }
];

const premiumFeatures = [
    { icon: <TrendingUpIcon fontSize="large" />, title: "Топ-оголошення", desc: "Ваші лоти завжди вгорі пошуку для миттєвих продажів." },
    { icon: <UnlimitedIcon fontSize="large" />, title: "Необмежений ліміт", desc: "Публікуйте стільки товарів, скільки вам потрібно." },
    { icon: <QueryStatsIcon fontSize="large" />, title: "Глибока аналітика", desc: "Відстежуйте перегляди, кліки та конверсію за 24 години." },
    { icon: <SupportAgentIcon fontSize="large" />, title: "Особистий менеджер", desc: "Допомога в налаштуванні реклами та вирішенні будь-яких питань." }
];

export default function Home() {
    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Box sx={{
                pt: { xs: 12, md: 22 },
                pb: { xs: 10, md: 16 },
                background: "radial-gradient(circle at 50% -20%, #eff6ff 0%, #ffffff 70%)",
                overflow: "hidden"
            }}>
                <Container maxWidth="lg">
                    <motion.div initial="initial" animate="animate" variants={staggerContainer}>
                        <motion.div variants={fadeInUp}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.8rem', md: '5.5rem' },
                                    fontWeight: 900,
                                    textAlign: 'center',
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    mb: 3,
                                    letterSpacing: '-0.04em',
                                    color: '#0f172a'
                                }}
                            >
                                Твій бізнес заслуговує <br />
                                <span style={{
                                    background: "linear-gradient(90deg, #6366f1, #a855f7)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>на краще охоплення</span>
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Typography
                                sx={{
                                    fontSize: { xs: '1.1rem', md: '1.5rem' },
                                    color: '#64748b',
                                    textAlign: 'center',
                                    maxWidth: '750px',
                                    mx: 'auto',
                                    mb: 8,
                                    lineHeight: 1.6
                                }}
                            >
                                Online Ads — це не просто дошка оголошень. Це потужна екосистема для швидких продажів та безпечних покупок. Продавай швидше, купуй розумніше.
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                                <Button
                                    component={Link}
                                    to="/marketplace"
                                    variant="contained"
                                    size="large"
                                    endIcon={<EastIcon />}
                                    sx={{
                                        px: 6, py: 2.2, borderRadius: '18px', fontSize: '1.1rem', fontWeight: 800,
                                        bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' }, textTransform: 'none',
                                        width: isMobile ? '100%' : 'auto'
                                    }}
                                >
                                    Відкрити Маркетплейс
                                </Button>

                            </Stack>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            {/* --- ПЕРЕВАГИ --- */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
                    <Box sx={{
                        display: 'grid',
                        gap: 4,
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }
                    }}>
                        {features.map((feature, index) => (
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.03, y: -5 }} key={index}>
                                <Paper elevation={0} sx={{
                                    p: 4, borderRadius: '32px', height: '100%',
                                    border: '1px solid #f1f5f9', bgcolor: '#f8fafc',
                                }}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 60, height: 60, borderRadius: '20px',
                                        bgcolor: '#fff', color: feature.color, mb: 3, boxShadow: '0 10px 20px rgba(0,0,0,0.04)'
                                    }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}>{feature.title}</Typography>
                                    <Typography sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>{feature.desc}</Typography>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>

            {/* --- ПРЕМІУМ РОЗДІЛ --- */}
            <Box sx={{ py: { xs: 10, md: 16 } }}>
                <Container maxWidth="lg">
                    <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
                        <motion.div variants={fadeInUp}>
                            <Paper sx={{
                                p: { xs: 5, md: 8 },
                                borderRadius: '40px',
                                bgcolor: '#0f172a',
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 40px 80px -20px rgba(15, 23, 42, 0.4)'
                            }}>
                                <Box sx={{
                                    position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '100%',
                                    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)',
                                    zIndex: 0
                                }} />

                                <Chip
                                    icon={<HourglassEmptyIcon style={{ color: '#fff' }} />}
                                    label="У розробці"
                                    sx={{
                                        position: 'absolute', top: { xs: 20, md: 32 }, right: { xs: 20, md: 32 },
                                        bgcolor: '#a855f7', color: '#fff', fontWeight: 800, px: 1,
                                        borderRadius: '12px', zIndex: 2
                                    }}
                                />

                                <Box sx={{ position: 'relative', zIndex: 1, mb: 8 }}>
                                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                                        Скоро: <span style={{ color: '#818cf8' }}>Premium</span>
                                    </Typography>
                                    <Typography sx={{ color: '#94a3b8', fontSize: { xs: '1.1rem', md: '1.3rem' }, maxWidth: '600px', lineHeight: 1.6 }}>
                                        Ми розробляємо інструменти професійного рівня для масштабування ваших продажів.
                                        Більше охоплення, жодних лімітів та детальна аналітика.
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'grid',
                                    gap: { xs: 4, md: 6 },
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                                    position: 'relative', zIndex: 1
                                }}>
                                    {premiumFeatures.map((feat, index) => (
                                        <Box key={index}>
                                            <Box sx={{ color: '#818cf8', mb: 2 }}>
                                                {feat.icon}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
                                                {feat.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                                                {feat.desc}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </motion.div>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={staggerContainer}>
                    <motion.div variants={fadeInUp}>
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-1px', color: '#0f172a' }}>
                            Готовий почати?
                        </Typography>
                        <Typography sx={{ color: '#64748b', mb: 6, fontSize: '1.2rem', maxWidth: '500px', mx: 'auto' }}>
                            Створи свій перший лот за 2 хвилини абсолютно безкоштовно.
                        </Typography>
                        <Button component={Link} to="/register" variant="contained" size="large" sx={{ bgcolor: '#0f172a', px: 6, py: 2, borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
                            Зареєструватися безкоштовно
                        </Button>
                    </motion.div>
                </motion.div>
            </Container>

            <Footer />
        </Box>
    );
}