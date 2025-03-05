import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from '@mui/material';

const MockTest = () => {
  const [questions, setQuestions] = useState([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 min countdown
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [email, setEmail] = useState('');

  // ✅ Verify Token Before Accessing Page
  useEffect(() => {
    const token = Cookies.get('auth_token'); // Get the token from cookies
    if (!token) {
      console.warn('User is not logged in. Redirecting to login page...');
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
          setEmail(response.data.email); // Store the email after token verification
          console.warn('Invalid token. Redirecting to login...');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/login', { replace: true });
      }
    };

    verifyToken();
  }, [navigate]);

  // ✅ Fetch Mock Test Questions
  const fetchMockTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://mc-qweb-backend.vercel.app/user/admin/getrandommocktest/${courseId}`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch questions');

      setQuestions(data.questions);
      setTotalAvailable(data.totalAvailable);
      setSubmitted(false);
      setAnswers({});
      setCorrectCount(0);
      setWrongCount(0);
      setTimeLeft(20 * 60);
      setTimerActive(true);
      setCurrentQuestionIndex(0); // Reset to first question
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ✅ Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
    if (timeLeft > 0 && !submitted && timerActive) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted, timerActive]);

  // ✅ Handle Answer Selection
  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  // ✅ Submit & Send Data
  const handleSubmit = async () => {
    setSubmitted(true);

    // ✅ Calculate Correct Answers
    const correctAnswersCount = questions.filter(
      (q) => answers[q._id] === q.correctOption
    ).length;

    // ✅ Get Total Attempted Questions
    const totalAttempted = Object.keys(answers).length;

    const token = Cookies.get('auth_token'); // Use token from cookies

    if (!token) {
      console.error('❌ Token not found! Cannot submit test.');
      navigate('/login', { replace: true });
      return;
    }
    console.log('✅ email found:', email);

    try {
      // ✅ Send Quiz Data to Backend
      await axios.post(
        'https://mc-qweb-backend.vercel.app/user/addtotalattendquation',
        {
          email,
          totalattend: totalAttempted,
          correct: correctAnswersCount,
        }
      );

      console.log('✅ User quiz data submitted successfully!');

      // ✅ Set Final Score
      setCorrectCount(correctAnswersCount);
      setWrongCount(totalAttempted - correctAnswersCount);
    } catch (error) {
      console.error('❌ Error updating quiz statistics:', error);
    }
  };

  // ✅ Format Time for Display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <Container maxWidth="md">
      <Box
        mt={5}
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h4" fontWeight="bold">
          Mock Test
        </Typography>

        {/* ✅ Show Timer Only When Test is Active */}
        {timerActive && !submitted && (
          <Typography variant="h6" color="error" fontWeight="bold">
            ⏳ Time Left: {formatTime(timeLeft)}
          </Typography>
        )}

        {/* ✅ Show Start Button Only If Test is NOT Active */}
        {!timerActive && !submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={fetchMockTest}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Start Mock Test'
            )}
          </Button>
        )}

        {/* ✅ Pagination: Show One Question at a Time */}
        {questions.length > 0 && !submitted && timerActive && (
          <Card sx={{ mt: 4, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {currentQuestionIndex + 1}.{' '}
                {questions[currentQuestionIndex].question}
              </Typography>

              {/* ✅ Option Buttons */}
              <Box display="flex" flexDirection="column" mt={3}>
                {questions[currentQuestionIndex].options.map((option, i) => (
                  <Button
                    key={i}
                    variant={
                      answers[questions[currentQuestionIndex]._id] === option
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      handleAnswerSelect(
                        questions[currentQuestionIndex]._id,
                        option
                      )
                    }
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              {/* ✅ Navigation Buttons */}
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  ⬅ Previous
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  >
                    Next ➡
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    disabled={submitted}
                  >
                    Submit Test
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default MockTest;
