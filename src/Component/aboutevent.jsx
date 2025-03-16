import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from '@mui/material';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          'https://mc-qweb-backend.vercel.app/user/verify-token',
          { token }
        );
        if (!response.data.valid) {
          navigate('/login', { replace: true });
          return;
        }
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/login', { replace: true });
      }
    };
    verifyToken();
  }, [navigate]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/useevent/event/${eventId}`
        );
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!email) return;

    const fetchReferralCount = async () => {
      try {
        const userProfile = await axios.post(
          'https://mc-qweb-backend.vercel.app/user/viewuserprofile',
          { email }
        );
        if (userProfile.data.profile.referralCount) {
          setReferralCount(userProfile.data.profile.referralCount);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchReferralCount();
  }, [email]);

  const handleJoinEvent = async () => {
    if (referralCount >= 3) {
      try {
        await axios.post(
          'https://mc-qweb-backend.vercel.app/user/deductreferrals',
          {
            email,
            deductCount: 3,
          }
        );

        setReferralCount((prevCount) => prevCount - 3);
        alert('You have successfully registered for the event!');
        navigate(`/joinevent/${eventId}`);
      } catch (error) {
        console.error('Error registering for event:', error);
        alert('Failed to register for the event. Please try again.');
      }
    } else {
      alert('You need to refer 3 people to register for this event.');
    }
  };

  if (loading)
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Container>
    );

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom textAlign="center">
            {event?.name}
          </Typography>
          <img
            src={event?.image}
            alt={event?.name}
            style={{
              width: '100%',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
            Your Referral Count: {referralCount}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mt: 2 }}
            fontSize={'1.7rem'}
            fontWeight={'bold'}
          >
            Description :
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
            {event?.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleJoinEvent}
            disabled={referralCount < 3}
            sx={{ mt: 2, py: 1, fontSize: '1rem', borderRadius: '8px' }}
          >
            Join Event
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EventDetailsPage;
