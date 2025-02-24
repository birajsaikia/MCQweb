import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(''); // Stores token after OTP verification

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/user/forgetpassword',
        { email }
      );
      setMessage(res.data.message);
      setStep(2); // Move to OTP verification
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error sending OTP');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://mc-qweb-backend.vercel.app/user/varifyOtp',
        {
          email,
          otp,
        }
      );
      setMessage('OTP Verified! Enter new password.');
      setToken(res.data.token); // Save token for password reset
      setStep(3); // Move to password reset step
    } catch (error) {
      setMessage(error.response?.data?.error || 'Invalid OTP');
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://mc-qweb-backend.vercel.app/user/resetpassword',
        {
          email,
          newPassword,
          token,
        }
      );
      setMessage('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error resetting password');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ padding: 3, mt: 5 }}>
        <Typography variant="h4" align="center">
          {step === 1
            ? 'Forgot Password'
            : step === 2
            ? 'Verify OTP'
            : 'Reset Password'}
        </Typography>
        {message && (
          <Typography color="primary" align="center">
            {message}
          </Typography>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
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
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <TextField
              label="Enter OTP"
              fullWidth
              margin="normal"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Verify OTP
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
