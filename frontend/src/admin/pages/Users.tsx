import  { useEffect, useState } from 'react';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  FormControlLabel, Switch, Typography, CircularProgress, Alert, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUsers, updateUser, type User } from '../adminApi'; // Переконайтесь, що шлях правильний

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Стейт для модального вікна
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});

  // Повідомлення про успіх/помилку
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Завантаження даних
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast('Не вдалося завантажити список', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Відкриття вікна редагування
  const handleEditClick = (user: User) => {
    setEditingUser({ ...user }); // Копіюємо об'єкт, щоб не змінювати таблицю напряму до збереження
    setOpen(true);
  };

  // Закриття вікна
  const handleClose = () => {
    setOpen(false);
    setEditingUser({});
  };

  // Збереження змін
  const handleSave = async () => {
    if (!editingUser.id) return;

    try {
      // Викликаємо API (ми створили цей метод на попередньому кроці)
      await updateUser(editingUser.id, editingUser);

      showToast('Користувача оновлено успішно', 'success');
      setOpen(false);
      loadUsers(); // Оновлюємо таблицю, щоб побачити зміни
    } catch (err) {
      console.error(err);
      showToast('Помилка при збереженні', 'error');
    }
  };

  // Допоміжна функція для тостів
  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  if (loading) return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Користувачі</Typography>
        <Button variant="outlined" onClick={loadUsers}>Оновити таблицю</Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ім'я</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Статус Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.is_email_verified ? (
                    <Chip label="Так" color="success" size="small" variant="outlined" />
                  ) : (
                    <Chip label="Ні" color="warning" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <Chip label="Адмін" color="primary" size="small" />
                  ) : (
                    <Chip label="Юзер" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- МОДАЛЬНЕ ВІКНО (POPUP) --- */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Редагування користувача (ID: {editingUser.id})</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

            <TextField
              label="Ім'я"
              fullWidth
              value={editingUser.name || ''}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />

            <TextField
              label="Email"
              fullWidth
              value={editingUser.email || ''}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />

            <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingUser.is_email_verified || false}
                    onChange={(e) => setEditingUser({ ...editingUser, is_email_verified: e.target.checked })}
                    color="success"
                  />
                }
                label="Email підтверджено"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={editingUser.is_admin || false}
                    onChange={(e) => setEditingUser({ ...editingUser, is_admin: e.target.checked })}
                    color="primary"
                  />
                }
                label="Права Адміністратора"
              />
            </Box>

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Скасувати</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Зберегти зміни
          </Button>
        </DialogActions>
      </Dialog>

      {/* Повідомлення (Snackbar) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;