import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'https://mc-qweb-backend.vercel.app/user/adminlogin',
        { email, password }
      );

      if (response.data.success) {
        console.log('Login successful');

        // Remove existing token if present
        if (Cookies.get('admin_token')) {
          Cookies.remove('admin_token');
        }

        // Store the new token
        Cookies.set('admin_token', response.data.token, { expires: 1 });

        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('Error occurred during login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
