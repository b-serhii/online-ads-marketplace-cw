import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function AuthLayout({ children }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,.18), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(56,189,248,.16), transparent 55%), #0B1220"
            : "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,.12), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(56,189,248,.10), transparent 55%), #F8FAFC",
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%" }}>
        {children}
      </Container>
    </Box>
  );
}
