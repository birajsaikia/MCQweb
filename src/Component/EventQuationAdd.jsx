import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EventQuestionAdd = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState('');
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
    fetchPreviousQuestions();
    const storedQuestions =
      JSON.parse(localStorage.getItem(`questions_${eventId}`)) || [];
    setSavedQuestions(storedQuestions);
  }, [eventId]);

  const verifyToken = async () => {
    const token = Cookies.get('admin_token');
    if (!token) {
      setIsTokenValid(false);
      navigate('/');
      return;
    }

    try {
      const response = await axios.post(
        'https://mc-qweb-backend.vercel.app/user/verify-tokenadmin',
        { token }
      );

      if (response.data.valid) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Admin verification failed:', error);
      setIsTokenValid(false);
      navigate('/');
    }
  };

  const fetchPreviousQuestions = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/useevent/events/${eventId}/questions`
      );
      setPreviousQuestions(response.data);
    } catch (error) {
      console.error('Error fetching previous questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (
      !question.trim() ||
      options.some((opt) => !opt.trim()) ||
      correctOptionIndex === ''
    ) {
      alert('Please fill in all fields.');
      return;
    }

    const newQuestion = {
      question,
      options,
      correctOptionIndex: parseInt(correctOptionIndex),
      eventId,
    };

    const updatedQuestions = [...savedQuestions, newQuestion];
    localStorage.setItem(
      `questions_${eventId}`,
      JSON.stringify(updatedQuestions)
    );
    setSavedQuestions(updatedQuestions);

    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex('');
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = savedQuestions.filter((_, i) => i !== index);
    localStorage.setItem(
      `questions_${eventId}`,
      JSON.stringify(updatedQuestions)
    );
    setSavedQuestions(updatedQuestions);
  };

  const handleFinalSubmit = async () => {
    if (savedQuestions.length === 0) {
      alert('No questions to submit.');
      return;
    }

    // Ensure the options are sent as an array
    const formattedQuestions = savedQuestions.map((q) => ({
      question: q.question,
      options: [...q.options], // Ensure options are an array
      correctOptionIndex: q.correctOptionIndex,
      eventId,
    }));

    try {
      console.log('Submitting Questions:', formattedQuestions); // Debugging Log

      const response = await axios.post(
        `https://mc-qweb-backend.vercel.app/user/useevent/events/${eventId}/questions`,
        { questions: formattedQuestions }, // Ensure options array is properly sent
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        localStorage.removeItem(`questions_${eventId}`);
        setSavedQuestions([]);
        alert('Questions saved successfully!');
      } else {
        alert('Questions saved successfully!');
      }
    } catch (error) {
      console.error('Error submitting questions:', error);
      alert('An error occurred while saving questions.');
    }
  };

  if (isTokenValid === null || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '600px', margin: 'auto', padding: '16px' }}>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', marginBottom: '16px' }}
      >
        Add Questions for Event
      </Typography>
      <Paper elevation={3} sx={{ padding: '16px' }}>
        <TextField
          label="Question"
          variant="outlined"
          fullWidth
          margin="normal"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((opt, index) => (
          <TextField
            key={index}
            label={`Option ${index + 1}`}
            variant="outlined"
            fullWidth
            margin="normal"
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}

        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          Select Correct Answer
        </Typography>
        <Select
          value={correctOptionIndex}
          onChange={(e) => setCorrectOptionIndex(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Correct Answer
          </MenuItem>
          {options.map((opt, index) => (
            <MenuItem key={index} value={index}>
              {opt}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          onClick={handleAddQuestion}
          fullWidth
          sx={{ marginTop: '16px' }}
        >
          Add Question
        </Button>
      </Paper>

      <Typography variant="h5" sx={{ marginTop: '24px' }}>
        Previously Added Questions
      </Typography>
      <List>
        {previousQuestions.length === 0 ? (
          <Typography>No previous questions found.</Typography>
        ) : (
          previousQuestions.map((q, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={q.question}
                secondary={`Correct Answer: ${q.options[q.correctOptionIndex]}`}
              />
            </ListItem>
          ))
        )}
      </List>

      <Typography variant="h5" sx={{ marginTop: '24px' }}>
        Saved Questions
      </Typography>
      <List>
        {savedQuestions.map((q, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={q.question}
              secondary={`Correct Answer: ${q.options[q.correctOptionIndex]}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleRemoveQuestion(index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {savedQuestions.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFinalSubmit}
          fullWidth
          sx={{ marginTop: '16px' }}
        >
          Final Submit
        </Button>
      )}
    </Box>
  );
};

export default EventQuestionAdd;
