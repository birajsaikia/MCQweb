import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const EventPage = () => {
  const [events, setEvents] = useState([]); // Store all events
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [joinedEvents, setJoinedEvents] = useState([]); // Store registered events
  const navigate = useNavigate();

  // Verify token and extract email
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

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'https://mc-qweb-backend.vercel.app/user/useevent/events'
        );
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch user profile data and referral count
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
        if (userProfile.data.profile.joinedEvents) {
          setJoinedEvents(userProfile.data.profile.joinedEvents);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchReferralCount();
  }, [email]);

  // Handle joining event
  const handleJoinEvent = async (eventId) => {
    if (referralCount >= 3) {
      try {
        await axios.post(
          'https://mc-qweb-backend.vercel.app/user/deductreferrals',
          {
            email,
            deductCount: 3,
          }
        );

        setJoinedEvents((prev) => [...prev, eventId]);
        setReferralCount((prevCount) => prevCount - 3);

        alert('You have successfully registered for the event!');

        // Redirect to the Joined Event Page
        navigate(`/joinevent/${eventId}`);
      } catch (error) {
        console.error('Error registering for event:', error);
        alert('Failed to register for the event. Please try again.');
      }
    } else {
      alert('You need to refer 3 people to register for this event.');
    }
  };
  const joinedEvent = async (eventId) => {
    navigate(`/aboutevent/${eventId}`);
  };
  const handleRenkEvent = async (eventId) => {
    navigate(`/toprank/${eventId}`);
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

  // Filter events with questions
  const filteredEvents = events.filter(
    (event) => event.questions && event.questions.length > 0
  );

  if (filteredEvents.length === 0)
    return <Typography>No events available.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Events
      </Typography>

      <Typography
        variant="h6"
        textAlign="center"
        sx={{ color: referralCount >= 3 ? 'green' : 'red', mb: 3 }}
      >
        {/* Your Referral Count: {referralCount}/3 */}
      </Typography>

      <Grid container spacing={3} style={{ justifyContent: 'center' }}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {/* {event.name} */}
                </Typography>
                <img
                  src={event.image}
                  alt={event.name}
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {/* {event.description} */}
                </Typography>

                {joinedEvents.includes(event._id) ? (
                  <Typography
                    sx={{
                      mt: 2,
                      color: 'green',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    ✅ Registered!
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => joinedEvent(event._id)}
                    sx={{
                      mt: 2,
                      py: 1,
                      fontSize: '1rem',
                      borderRadius: '8px',
                    }}
                  >
                    Register
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleRenkEvent(event._id)}
                  sx={{
                    mt: 2,
                    py: 1,
                    fontSize: '1rem',
                    borderRadius: '8px',
                  }}
                >
                  Top Rank Holder
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventPage;
