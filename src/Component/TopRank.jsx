import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const EventLeaderboard = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/useevent/event/${eventId}`
        );

        if (response.status !== 200) throw new Error('Failed to fetch event');

        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading)
    return (
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );

  if (!event || !event.user || event.user.length === 0)
    return (
      <Container style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6">
          No users participated in this event.
        </Typography>
      </Container>
    );

  // Ensure `marks` and `time` are numbers
  const sortedUsers = [...event.user]
    .map((user) => ({
      ...user,
      marks: Number(user.marks), // Convert to number
      time: Number(user.time), // Convert to number
    }))
    .sort((a, b) => {
      if (b.marks !== a.marks) return b.marks - a.marks; // Higher marks first
      return a.time - b.time; // Lower time first (faster submissions)
    })
    .slice(0, 10); // Get top 10 users

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        🏆 {event.name} Leaderboard
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {event.description}
      </Typography>
      <img
        src={event.image}
        alt={event.name}
        style={{
          display: 'block',
          margin: '0 auto',
          width: 'auto',
          maxWidth: 'auto',
          height: '200px',
          borderRadius: '10px',
        }}
      />

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#1976D2' }}>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Rank
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Marks
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Time Taken (s)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>
                  <b>#{index + 1}</b>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.marks}</TableCell>
                <TableCell>{user.time} sec</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EventLeaderboard;
