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
  Paper,
} from '@mui/material';

const ViewQuestionsPage = () => {
  const { courseId, subjectId, cosubjectId } = useParams();
  const [questions, setQuestions] = useState([]);

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

  const handleDeleteQuestion = async (questionId) => {
    console.log(questionId);
    try {
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/quations/${courseId}/${subjectId}/${cosubjectId}/${questionId}`
      );
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: 'center', fontWeight: 'bold' }}
      >
        View Questions
      </Typography>

      {questions.length > 0 ? (
        <Grid container spacing={3}>
          {questions.map((q) => (
            <Grid item xs={12} key={q._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {q.question}
                  </Typography>

                  <Stack spacing={1}>
                    {q.options.map((option, index) => (
                      <Paper
                        key={index}
                        sx={{
                          padding: 1,
                          backgroundColor:
                            option === q.correctOption ? '#e3f2fd' : '#f5f5f5',
                        }}
                      >
                        <Typography>{option}</Typography>
                      </Paper>
                    ))}
                  </Stack>

                  <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteQuestion(q._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mt: 3, color: 'gray' }}
        >
          No questions available.
        </Typography>
      )}
    </Container>
  );
};

export default ViewQuestionsPage;
