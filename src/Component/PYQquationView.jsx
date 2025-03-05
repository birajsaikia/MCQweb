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
} from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

const ViewPYQPractice = () => {
  const { courseId, paperId, name, year } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [paperName, setPaperName] = useState(''); // ✅ Added state for paper name
  //   const [year, setYear] = useState(''); // ✅ Added state for year
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  // ✅ Verify Token Before Fetching PYQs
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      console.warn('User not logged in. Redirecting to login...');
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
          console.warn('Invalid token. Redirecting to login...');
          navigate('/login', { replace: true });
          return;
        }

        setEmail(response.data.email);
        fetchPYQQuestions();
      } catch (error) {
        setError('Error verifying token.');
        setLoading(false);
      }
    };

    const fetchPYQQuestions = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/admin/getpreviousyearquestions/${courseId}/${paperId}`
        );

        console.log('✅ Full Response:', response.data); // Debugging log

        if (response.status !== 200)
          throw new Error('Failed to fetch PYQ questions');

        // ✅ Set paper name and year if available
        // ✅ Ensure correct data format
        const fetchedQuestions = response.data.questions || response.data || [];

        if (fetchedQuestions.length === 0) {
          console.warn('⚠ No questions found!');
          setError('No questions available for this paper.');
        }

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error(
          '❌ Error fetching questions:',
          error.response?.data || error
        );
        setError(error.response?.data?.message || 'Error fetching questions.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [courseId, paperId, navigate]);

  // ✅ Handle Answer Selection
  const handleAnswerSelection = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // ✅ Handle Submission & Send Data to Backend
  const handleSubmit = async () => {
    setSubmitted(true);

    if (!email) {
      console.error('❌ Email is missing. Cannot submit test.');
      return;
    }

    const correctAnswersCount = questions.filter(
      (q) => selectedAnswers[q._id] === q.correctOption
    ).length;

    const totalAttempted = Object.keys(selectedAnswers).length;

    try {
      await axios.post(
        'https://mc-qweb-backend.vercel.app/user/addtotalattendquation',
        { email, totalattend: totalAttempted, correct: correctAnswersCount }
      );

      console.log('✅ PYQ practice statistics updated successfully.');
    } catch (error) {
      console.error(
        '❌ Error updating user PYQ statistics:',
        error.response?.data || error
      );
    }
  };

  // ✅ Loading State
  if (loading) {
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
  }

  // ✅ Error State
  if (error) {
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
  }

  return (
    <Container style={{ padding: '20px' }}>
      {/* ✅ Show Paper Name & Year */}
      <Typography variant="h4" align="center" gutterBottom>
        {name} - {year}
      </Typography>

      <Typography variant="h5" align="center" gutterBottom>
        Previous Year Questions (PYQ) Practice
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

      {/* Submit Button */}
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

      {/* Show Results */}
      {submitted && (
        <Typography
          variant="h6"
          align="center"
          style={{
            marginTop: '30px',
            backgroundColor: '#f0f8ff',
            padding: '15px',
            borderRadius: '10px',
            color: '#333',
          }}
        >
          You answered{' '}
          {
            questions.filter((q) => selectedAnswers[q._id] === q.correctOption)
              .length
          }{' '}
          out of {questions.length} questions correctly!
        </Typography>
      )}
    </Container>
  );
};

export default ViewPYQPractice;
