import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

const JoinedEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

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
        setEmail(response.data.email);
        if (!response.data.valid) {
          navigate('/login', { replace: true });
          return;
        }
        fetchEventDetails();
      } catch (error) {
        setError('Error verifying token.');
        setLoading(false);
      }
    };

    verifyToken();
  }, [eventId, navigate]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/useevent/event/${eventId}`
      );

      setEvent(response.data);
      setQuestions(response.data.questions || []);

      if (response.data.time) {
        setTimeLeft(parseInt(response.data.time, 10) * 60);
      } else {
        setTimeLeft(300);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown Timer
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswerSelection = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const correctAnswersCount = questions.filter(
      (q) => selectedAnswers[q._id] === q.options[q.correctOptionIndex] // ✅ Fix correct answer checking
    ).length;
    console.log(
      'https://mc-qweb-backend.vercel.app/user/useevent/events/submit'
    );
    try {
      await axios.post(
        'https://mc-qweb-backend.vercel.app/user/useevent/events/submit',
        {
          eventId,
          email,
          timeTaken: event?.time
            ? parseInt(event.time, 10) * 60 - timeLeft
            : 300 - timeLeft,
          answers: selectedAnswers,
          correctAnswers: correctAnswersCount,
        }
      );
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

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
          Error: {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        {event?.name || 'Event Questions'}
      </Typography>

      {/* Timer UI */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFEB3B',
          padding: '10px 20px',
          borderRadius: '8px',
          width: 'fit-content',
          margin: '0 auto 20px auto',
          fontWeight: 'bold',
          fontSize: '1.5rem',
        }}
      >
        ⏳ Time Left: {Math.floor(timeLeft / 60)}:
        {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
      </Box>

      <Grid container spacing={3}>
        {questions.map((question) => (
          <Grid item key={question._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{question.question}</Typography>

                {question.options.map((option, index) => {
                  const isSelected = selectedAnswers[question._id] === option;
                  const isCorrect =
                    submitted &&
                    question.options[question.correctOptionIndex] === option;

                  return (
                    <Button
                      key={index}
                      variant={isSelected ? 'contained' : 'outlined'}
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        backgroundColor: isSelected
                          ? isCorrect
                            ? 'green'
                            : 'red'
                          : '#ffffff',
                        color: isSelected ? 'white' : 'black',
                      }}
                      onClick={() =>
                        handleAnswerSelection(question._id, option)
                      }
                    >
                      {option}
                    </Button>
                  );
                })}

                {/* Show correct answer only after submitting */}
                {submitted && (
                  <Typography
                    variant="body2"
                    style={{
                      marginTop: '10px',
                      color: 'blue',
                      fontWeight: 'bold',
                    }}
                  >
                    ✅ Correct Answer:{' '}
                    {question.options[question.correctOptionIndex]}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!submitted && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{
            marginTop: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Submit
        </Button>
      )}
    </Container>
  );
};

export default JoinedEventPage;
