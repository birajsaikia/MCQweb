import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://mc-qweb-backend.vercel.app/user/forgetpassword',
        { email }
      );
      setMessage(res.data.message);

      // Redirect to reset password page with email
      setTimeout(() => {
        navigate(`/resetpassword?email=${email}`);
      }, 2000); // Delay for better UX
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error sending OTP');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ padding: 3, mt: 5 }}>
        <Typography variant="h4" gutterBottom align="center">
          Forgot Password
        </Typography>
        {message && (
          <Typography color="primary" align="center">
            {message}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Send OTP
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
