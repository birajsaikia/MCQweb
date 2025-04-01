import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const ViewQuestionsPage = () => {
  const { courseId, subjectId, cosubjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, [courseId, subjectId, cosubjectId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/quations/${courseId}/${subjectId}/${cosubjectId}`
      );
      console.log('Fetched Data:', response.data);
      setQuestions(response.data.quations || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowDialog(true);

    const correctAnswersCount = questions.filter(
      (q) => selectedAnswers[q._id] === q.correctOption
    ).length;

    setCorrectCount(correctAnswersCount);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: 'center', fontWeight: 'bold' }}
      >
        Solve Questions
      </Typography>

      {questions.length > 0 ? (
        <Box>
          <Grid container spacing={3}>
            {questions.map((q, index) => (
              <Grid item xs={12} key={q._id}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Q{index + 1}: {q.question}
                    </Typography>

                    <RadioGroup
                      value={selectedAnswers[q._id] || ''}
                      onChange={(e) =>
                        handleAnswerChange(q._id, e.target.value)
                      }
                    >
                      {q.options.map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={option}
                          control={<Radio color="primary" />}
                          label={option}
                          sx={{ paddingY: 1 }}
                        />
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {!submitted && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, display: 'block', mx: 'auto' }}
              onClick={handleSubmit}
            >
              Submit Answers
            </Button>
          )}
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mt: 3, color: 'gray' }}
        >
          No questions available.
        </Typography>
      )}

      {/* Results Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Test Results</DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="primary">
            📊 Total Questions Attempted: {Object.keys(selectedAnswers).length} / {questions.length}
          </Typography>
          <Typography variant="h6" color="success.main">
            ✅ Correct Answers: {correctCount} / {questions.length}
          </Typography>
          <Typography variant="h6" color="error.main">
            ❌ Incorrect Answers: {Object.keys(selectedAnswers).length - correctCount}
          </Typography>
          <Typography variant="h6" color="text.primary">
            🏆 Total Marks: {correctCount * 4} {/* Adjust marks-per-question */}
          </Typography>
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

export default ViewQuestionsPage;
