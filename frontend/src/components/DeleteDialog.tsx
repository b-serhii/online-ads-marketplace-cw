import { Dialog, DialogContent, Typography, Button, Box, Stack, IconButton, Slide } from "@mui/material";
import type {TransitionProps} from '@mui/material/transitions';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import React from "react";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteAdDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    adTitle?: string;
}

export default function DeleteAdDialog({ open, onClose, onConfirm, adTitle }: DeleteAdDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: '28px',
                    padding: '16px',
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
                }
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', right: 16, top: 16, bgcolor: '#f1f5f9' }}
            >
                <CloseRoundedIcon fontSize="small" />
            </IconButton>

            <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                <Box sx={{
                    width: 72, height: 72, borderRadius: '50%', bgcolor: '#fee2e2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3
                }}>
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 36, color: '#ef4444' }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
                    Видалити оголошення?
                </Typography>

                <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                    Ви впевнені, що хочете видалити <b>{adTitle || "це оголошення"}</b>? Цю дію неможливо буде скасувати, і всі дані будуть втрачені.
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        sx={{ borderRadius: '14px', py: 1.5, fontWeight: 700, color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none' }}
                    >
                        Скасувати
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={onConfirm}
                        sx={{ borderRadius: '14px', py: 1.5, fontWeight: 700, bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }}
                    >
                        Видалити
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}