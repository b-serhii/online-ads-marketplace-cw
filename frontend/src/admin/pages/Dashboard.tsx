import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { adminStats } from "../../services/admin";
import { LineChart } from "@mui/x-charts/LineChart";

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <Card
            component={motion.div}
            whileHover={{ y: -4 }}
            sx={{
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9",
            }}
        >
            <CardContent>
                <Typography sx={{ color: 'text.secondary', fontSize: 13, fontWeight: 600 }}>{title}</Typography>
                <Typography sx={{ fontSize: 36, fontWeight: 900, mt: 0.5, color: '#0f172a' }}>{value}</Typography>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({ users: 0, active: 0, admins: 0 });

    useEffect(() => {
        (async () => {
            try {
                const s = await adminStats();
                if (s) setStats(s); // Оновлення даних, якщо бекенд відповів
            } catch (err) {
                console.error("Помилка завантаження статистики:", err);
            }
        })();
    }, []);

    return (
        <Stack spacing={4}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                Панель керування
            </Typography>

            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
                <StatCard title="Всього користувачів" value={stats.users} />
                <StatCard title="Активні оголошення" value={stats.active} />
                <StatCard title="Адміністратори" value={stats.admins} />
            </Box>

            <Card sx={{ borderRadius: 6, border: "1px solid #f1f5f9", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Активність системи</Typography>
                    <LineChart
                        height={300}
                        series={[{ data: [12, 18, 15, 22, 28, 32, 27], color: '#6366f1', area: true }]}
                        xAxis={[{ data: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"], scaleType: "band" }]}
                    />
                </CardContent>
            </Card>
        </Stack>
    );
}