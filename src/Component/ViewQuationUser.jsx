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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

const ViewQuestionUser = () => {
  const { courseId, subjectId, cosubjectId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [showDialog, setShowDialog] = useState(false); // Popup visibility
  const [showResults, setShowResults] = useState(false); // To keep results visible after closing

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
        fetchQuestions();
      } catch (error) {
        setError('Error verifying token.');
        setLoading(false);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/admin/quations/${courseId}/${subjectId}/${cosubjectId}`
        );

        if (response.status !== 200)
          throw new Error('Failed to fetch questions');

        let fetchedQuestions = response.data.quations || [];

        // Fisher-Yates shuffle algorithm
        for (let i = fetchedQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [fetchedQuestions[i], fetchedQuestions[j]] = [
            fetchedQuestions[j],
            fetchedQuestions[i],
          ];
        }

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [courseId, navigate]);

  const handleAnswerSelection = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption, // Store selected answer
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setShowDialog(true); // Open the popup
    setShowResults(true); // Keep results visible after closing

    const correctAnswersCount = questions.filter(
      (q) => selectedAnswers[q._id] === q.correctOption
    ).length;

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
        Questions
      </Typography>
      <Grid container spacing={3}>
        {questions.map((question) => (
          <Grid item key={question._id} xs={12} sm={6} md={4}>
            <Card
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: '0.3s ease',
                padding: '10px',
              }}
            >
              <CardContent>
                <Typography variant="h6">{question.question}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: '10px' }}
                >
                  Choose an answer:
                </Typography>

                {question.options.map((option, index) => {
                  const isSelected = selectedAnswers[question._id] === option;
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? 'contained' : 'outlined'}
                      style={{
                        display: 'block',
                        margin: '10px 0',
                        width: '100%',
                        textAlign: 'left',
                        backgroundColor: isSelected ? '#2196F3' : '#ffffff',
                        color: isSelected ? 'white' : 'black',
                        border: '1px solid #ddd',
                        transition: '0.3s ease-in-out',
                      }}
                      onClick={() =>
                        handleAnswerSelection(question._id, option)
                      }
                    >
                      {option}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!submitted && (
        <Button
          variant="contained"
          color="primary"
          style={{
            marginTop: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      )}

      {/* Popup Dialog for Answers */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Your Results</DialogTitle>
        <DialogContent>
          <Typography>
            You answered{' '}
            {
              questions.filter(
                (q) => selectedAnswers[q._id] === q.correctOption
              ).length
            }{' '}
            out of {questions.length} questions correctly!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Results on Page After Closing */}
      {showResults && (
        <Container style={{ marginTop: '30px', textAlign: 'center' }}>
          <Typography variant="h5">Your Answers</Typography>
          {questions.map((q) => (
            <Typography
              key={q._id}
              style={{
                marginTop: '10px',
                color:
                  selectedAnswers[q._id] === q.correctOption ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {q.question} <br />
              Your Answer: {selectedAnswers[q._id] || 'Not Answered'}{' '}
              {selectedAnswers[q._id] === q.correctOption ? '✅' : '❌'} <br />
              Correct Answer: {q.correctOption}
            </Typography>
          ))}
        </Container>
      )}
    </Container>
  );
};

export default ViewQuestionUser;
