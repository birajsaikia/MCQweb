import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies to store the token

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [serverMessage, setServerMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://mc-qweb-backend.vercel.app/user/login', // Replace with your actual API endpoint
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store the JWT token in cookies
      Cookies.set('auth_token', response.data.token, { expires: 1 }); // Store token for 1 day

      setServerMessage({
        type: 'success',
        text: 'Login successful! Redirecting...',
      });

      // Redirect to the home page or dashboard
      setTimeout(() => {
        window.location.href = '/'; // Replace with the route where you want to redirect
      }, 2000);
    } catch (err) {
      setServerMessage({
        type: 'error',
        text: err.response?.data?.error || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ padding: 6, mt: 2, mx: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        {serverMessage && (
          <Typography
            color={serverMessage.type === 'error' ? 'error' : 'primary'}
            align="center"
            sx={{ mb: 2 }}
          >
            {serverMessage.text}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="body1" sx={{ margin: '10px' }} align="center">
          <Link to="/resetpassword">Forget Password</Link>
        </Typography>
        <Typography variant="body1" sx={{ margin: '10px' }} align="center">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
