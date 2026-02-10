import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const MotionBox = motion(Box);

type Props = { children: ReactNode };

export default function AuthCard({ children }: Props) {
  const theme = useTheme();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        width: "100%",
        maxWidth: 460,
        borderRadius: 4,
        p: { xs: 3, sm: 4 },
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 24px 60px rgba(0,0,0,.45)"
            : "0 24px 60px rgba(16,24,40,.14)",
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,.10)"
            : "rgba(15,23,42,.10)",
        background:
          theme.palette.mode === "dark"
            ? "rgba(15,23,42,.72)"
            : "rgba(255,255,255,.75)",
        backdropFilter: "blur(14px)",
      }}
    >
      {children}
    </MotionBox>
  );
}
