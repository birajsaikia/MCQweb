import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
} from '@mui/material';

const MockTestPage = () => {
  const { courseId, paperId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

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
        fetchQuestions();
      } catch (error) {
        setError('Error verifying token.');
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/getmocktestquestions/${courseId}/${paperId}`
      );
      setQuestions(response.data || []);
      setLoading(false);
    } catch (error) {
      setError('Failed to load questions.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setShowDialog(true);

    const correctAnswersCount = questions.filter(
      (q) => selectedAnswers[q._id] === q.correctOption
    ).length;
    setCorrectCount(correctAnswersCount);

    try {
      await axios.post(
        'https://mc-qweb-backend.vercel.app/user/addtotalattendquation',
        {
          email,
          totalattend: Object.keys(selectedAnswers).length,
          correct: correctAnswersCount,
        }
      );
    } catch (error) {
      console.error('Error updating user quiz statistics:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Mock Test
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && questions.length > 0 && (
        <Box>
          {questions.map((q, index) => (
            <Card
              key={q._id}
              variant="outlined"
              sx={{
                marginBottom: 2,
                backgroundColor:
                  submitted && selectedAnswers[q._id] !== q.correctOption
                    ? '#ffebee'
                    : '#fff',
                borderLeft: '5px solid #1976d2',
                '&:hover': { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' },
                transition: '0.3s',
              }}
            >
              <CardContent>
                <Typography variant="h6">{`Q${index + 1}: ${
                  q.question
                }`}</Typography>
                <RadioGroup
                  value={selectedAnswers[q._id] || ''}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                >
                  {q.options.map((opt, i) => (
                    <FormControlLabel
                      key={i}
                      value={opt}
                      control={<Radio color="primary" />}
                      label={opt}
                      sx={{
                        backgroundColor:
                          submitted &&
                          opt === q.correctOption &&
                          selectedAnswers[q._id] !== q.correctOption
                            ? '#c8e6c9'
                            : 'inherit',
                        borderRadius: '5px',
                        padding: '5px',
                        marginY: '3px',
                      }}
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {!submitted && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, display: 'block', mx: 'auto' }}
              onClick={handleSubmit}
            >
              Submit Test
            </Button>
          )}
        </Box>
      )}

      {/* ✅ Results Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Mock Test Results</DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="success.main">
            ✅ Correct Answers: {correctCount} / {questions.length}
          </Typography>
          <Typography variant="h6" color="error.main">
            ❌ Incorrect Answers: {questions.length - correctCount}
          </Typography>
          {submitted && (
            <Typography variant="body2" color="textSecondary">
              Highlighted questions in red indicate incorrect answers.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDialog(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MockTestPage;
