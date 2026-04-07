import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import { register as apiRegister } from "../services/auth";
import { useAuth } from "../auth/AuthContext.tsx";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { doLogin } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agree, setAgree] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const passwordHint = useMemo(() => "Мінімум 8 символів (bcrypt до 72)", []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!agree) return setError("Потрібно погодитись з умовами");
        if (password !== confirm) return setError("Паролі не співпадають");
        if (password.length > 72) return setError("Пароль має бути до 72 символів (bcrypt)");

        setLoading(true);
        try {
            const res = await apiRegister({ name, email, password });
            setMessage(res?.message ?? "Перевір пошту для підтвердження email");

            // Якщо у тебе логін дозволений тільки після verify — тоді прибери автологін нижче.
            // Якщо можна логінитись одразу — залишай.
            try {
                await doLogin(email, password);
                navigate("/profile");
            } catch {
                // якщо не можна увійти до підтвердження — просто лишаємо message
            }
        } catch (err: any) {
            setError(err?.response?.data?.detail ?? "Помилка реєстрації");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <AuthCard>
                <Stack spacing={2.2}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            Реєстрація
                        </Typography>
                        <Typography sx={{ mt: 0.5, opacity: 0.72, fontSize: 14 }}>
                            Створи акаунт за хвилину.
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                        <Button fullWidth variant="outlined" sx={{ py: 1.15, borderRadius: 2 }} disabled>
                            Google
                        </Button>
                        <Button fullWidth variant="outlined" sx={{ py: 1.15, borderRadius: 2 }} disabled>
                            GitHub
                        </Button>
                    </Stack>

                    <Divider sx={{ opacity: 0.6 }}>або</Divider>

                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={1.6}>
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                label="Імʼя"
                                placeholder="Наприклад: Сергій"
                                fullWidth
                                required
                                autoComplete="name"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                label="Email"
                                placeholder="name@example.com"
                                fullWidth
                                required
                                autoComplete="email"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                label="Пароль"
                                placeholder={passwordHint}
                                fullWidth
                                required
                                autoComplete="new-password"
                                helperText="bcrypt ліміт: до 72 символів"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    edge="end"
                                                    aria-label="toggle password visibility"
                                                >
                                                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                type={showConfirm ? "text" : "password"}
                                label="Повтори пароль"
                                fullWidth
                                required
                                autoComplete="new-password"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirm((v) => !v)}
                                                    edge="end"
                                                    aria-label="toggle confirm password visibility"
                                                >
                                                    {showConfirm ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agree}
                                        onChange={(e) => setAgree(e.target.checked)}
                                        required
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: 14 }}>
                                        Погоджуюсь з{" "}
                                        <Link component="button" underline="hover" sx={{ fontWeight: 700 }}>
                                            умовами
                                        </Link>
                                    </Typography>
                                }
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ py: 1.2, borderRadius: 2.2, fontWeight: 800, textTransform: "none" }}
                            >
                                {loading ? "Створюємо..." : "Створити акаунт"}
                            </Button>
                        </Stack>
                    </Box>

                    <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
                        Вже є акаунт?{" "}
                        <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 800 }}>
                            Увійти
                        </Link>
                    </Typography>
                </Stack>
            </AuthCard>
        </AuthLayout>
    );
}
