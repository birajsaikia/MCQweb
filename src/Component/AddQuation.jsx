import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AddQuestionPage = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [coSubjects, setCoSubjects] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCoSubject, setSelectedCoSubject] = useState('');

  const [addedCoSubjects, setAddedCoSubjects] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [savedQuestions, setSavedQuestions] = useState([]);

  useEffect(() => {
    fetchCourses();
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    setSavedQuestions(storedQuestions);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        'https://mc-qweb-backend.vercel.app/user/admin/course'
      );
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (selectedCourse) fetchSubjects(selectedCourse);
  }, [selectedCourse]);

  const fetchSubjects = async (courseId) => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/subject/${courseId}`
      );
      setSubjects(response.data.subjects || response.data);
      setCoSubjects([]);
      setAddedCoSubjects([]);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    if (selectedSubject) fetchCoSubjects(selectedSubject);
  }, [selectedSubject]);

  const fetchCoSubjects = async (subjectId) => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/cosubject/${selectedCourse}/${subjectId}`
      );
      setCoSubjects(response.data.cosubject || []);
    } catch (error) {
      console.error('Error fetching co-subjects:', error);
    }
  };

  const handleAddCoSubject = () => {
    if (selectedCoSubject && !addedCoSubjects.includes(selectedCoSubject)) {
      setAddedCoSubjects([...addedCoSubjects, selectedCoSubject]);
      setSelectedCoSubject('');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveCoSubject = (coSubId) => {
    setAddedCoSubjects(addedCoSubjects.filter((id) => id !== coSubId));
  };

  const handleAddQuestion = () => {
    if (
      question.trim() &&
      options.every((opt) => opt.trim()) &&
      answer.trim()
    ) {
      const newQuestion = {
        question,
        options,
        answer,
        course: selectedCourse,
        subject: selectedSubject,
        coSubjects: addedCoSubjects,
      };

      console.log('New Question Being Added:', newQuestion); // Debugging

      const updatedQuestions = [...savedQuestions, newQuestion];

      localStorage.setItem('questions', JSON.stringify(updatedQuestions));
      setSavedQuestions(updatedQuestions);

      console.log('Updated Local Storage:', localStorage.getItem('questions')); // Debugging

      setQuestion('');
      setOptions(['', '', '', '']);
      setAnswer('');
    } else {
      alert('Please fill all fields before adding the question.');
    }
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = savedQuestions.filter((_, i) => i !== index);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    setSavedQuestions(updatedQuestions);
  };

  const handleFinalSubmit = async () => {
    if (!selectedCourse || !selectedSubject || addedCoSubjects.length === 0) {
      alert(
        'Please select a Course, Subject, and add at least one Co-Subject.'
      );
      return;
    }

    if (savedQuestions.length === 0) {
      alert('No questions to submit.');
      return;
    }

    const formattedQuestions = savedQuestions.map((q) => ({
      question: q.question,
      options: q.options,
      correctOption: q.answer,
      courseId: selectedCourse,
      subjectId: selectedSubject,
      coSubjects: addedCoSubjects,
    }));

    try {
      const response = await axios.post(
        `https://mc-qweb-backend.vercel.app/user/admin/addquestion/`,
        { questions: formattedQuestions },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        localStorage.removeItem('questions');
        setSavedQuestions([]);
        alert('Questions saved successfully!');
        localStorage.removeItem('questions');
      } else {
        console.log('Unexpected Response:', response);
        localStorage.removeItem('questions'); // ✅ Delete localStorage on error
        setSavedQuestions([]); // ✅ Clear state on error
        alert('Questions saved successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(
        error.response?.data?.message ||
          'An error occurred while saving questions.'
      );
    }
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: 2 }}
    >
      <Typography variant="h4">Add Questions</Typography>

      <Typography>Select Course</Typography>
      <Select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Course
        </MenuItem>
        {courses.map((course) => (
          <MenuItem key={course._id} value={course._id}>
            {course.name}
          </MenuItem>
        ))}
      </Select>

      {subjects.length > 0 && (
        <>
          <Typography>Select Subject</Typography>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Subject
            </MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </>
      )}

      {coSubjects.length > 0 && (
        <>
          <Typography>Select Co-Subject</Typography>
          <Select
            value={selectedCoSubject}
            onChange={(e) => setSelectedCoSubject(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Co-Subject
            </MenuItem>
            {coSubjects.map((cosub) => (
              <MenuItem key={cosub._id} value={cosub._id}>
                {cosub.name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleAddCoSubject}>
            Add Co-Subject
          </Button>
        </>
      )}

      <Divider />

      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((opt, index) => (
        <TextField
          key={index}
          label={`Option ${index + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}

      <Typography>Select Correct Answer</Typography>
      <Select
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        displayEmpty
      >
        {options.map((opt, index) => (
          <MenuItem key={index} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>

      <Button variant="contained" onClick={handleAddQuestion}>
        Add Question
      </Button>

      <Divider />
      <Typography variant="h5">Saved Questions</Typography>
      <List>
        {savedQuestions.map((q, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={q.question}
              secondary={`Answer: ${q.answer}`}
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

      <Button variant="contained" color="primary" onClick={handleFinalSubmit}>
        Final Submit
      </Button>
    </Box>
  );
};

export default AddQuestionPage;
