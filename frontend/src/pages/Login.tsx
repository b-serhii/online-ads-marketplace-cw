import { Link as RouterLink } from "react-router-dom";
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
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <AuthCard>
        <Stack spacing={2.2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Вхід в акаунт
            </Typography>
            <Typography sx={{ mt: 0.5, opacity: 0.72, fontSize: 14 }}>
              Увійди, щоб продовжити.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <Button fullWidth variant="outlined" sx={{ py: 1.15, borderRadius: 2 }}>
              Google
            </Button>
            <Button fullWidth variant="outlined" sx={{ py: 1.15, borderRadius: 2 }}>
              GitHub
            </Button>
          </Stack>

          <Divider sx={{ opacity: 0.6 }}>або</Divider>

          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={1.6}>
              <TextField
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
                type={showPassword ? "text" : "password"}
                label="Пароль"
                placeholder="Введи пароль"
                fullWidth
                required
                autoComplete="current-password"
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
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <FormControlLabel
                  control={<Checkbox />}
                  label={<Typography sx={{ fontSize: 14 }}>Запамʼятати</Typography>}
                />

                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="hover"
                  sx={{ fontSize: 14, fontWeight: 600 }}
                >
                  Забув пароль?
                </Link>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ py: 1.2, borderRadius: 2.2, fontWeight: 800, textTransform: "none" }}
              >
                Увійти
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
            Немає акаунту?{" "}
            <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 800 }}>
              Зареєструватися
            </Link>
          </Typography>
        </Stack>
      </AuthCard>
    </AuthLayout>
  );
}
