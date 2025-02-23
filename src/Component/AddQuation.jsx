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

  // Fetch Courses
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

  // Fetch Subjects when a Course is selected
  const fetchSubjects = async (courseId) => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/subject/${courseId}`
      );
      setSubjects(response.data.subjects || response.data);
      setSelectedSubject('');
      setCoSubjects([]);
      setSelectedCoSubject('');
      setAddedCoSubjects([]); // Reset Co-Subjects when changing Course
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  // Fetch Co-Subjects when a Subject is selected
  const fetchCoSubjects = async (subjectId) => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/cosubject/${selectedCourse}/${subjectId}`
      );
      setCoSubjects(response.data.cosubject || []);
      setSelectedCoSubject('');
    } catch (error) {
      console.error('Error fetching co-subjects:', error);
    }
  };

  // Add Co-Subject to the List
  const handleAddCoSubject = () => {
    if (selectedCoSubject && !addedCoSubjects.includes(selectedCoSubject)) {
      setAddedCoSubjects([...addedCoSubjects, selectedCoSubject]);
      setSelectedCoSubject('');
    }
  };
  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Remove Co-Subject from List
  const handleRemoveCoSubject = (coSubId) => {
    const updatedList = addedCoSubjects.filter((id) => id !== coSubId);
    setAddedCoSubjects(updatedList);
  };

  // Add Question to Local Storage
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

      const updatedQuestions = [...savedQuestions, newQuestion];
      localStorage.setItem('questions', JSON.stringify(updatedQuestions));
      setSavedQuestions(updatedQuestions);

      setQuestion('');
      setOptions(['', '', '', '']);
      setAnswer('');
    }
  };

  // Remove Question from Local Storage
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = savedQuestions.filter((_, i) => i !== index);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    setSavedQuestions(updatedQuestions);
  };

  // Final Submit to Backend
  const handleFinalSubmit = async () => {
    if (!selectedCourse || !selectedSubject || addedCoSubjects.length === 0) {
      alert(
        'Please select a Course, Subject, and add at least one Co-Subject.'
      );
      return;
    }

    const formattedQuestions = savedQuestions.map((q) => ({
      question: q.question,
      options: q.options,
      correctOption: q.answer,
      courseId: selectedCourse,
      subjectId: selectedSubject,
      coSubjects: addedCoSubjects, // Send all selected co-subjects
    }));

    console.log(
      'Payload being sent:',
      JSON.stringify({ questions: formattedQuestions }, null, 2)
    );

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
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error response:', error.response?.data);
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

      {/* Course Selection */}
      <Typography>Select Course</Typography>
      <Select
        value={selectedCourse}
        onChange={(e) => {
          setSelectedCourse(e.target.value);
          fetchSubjects(e.target.value);
        }}
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

      {/* Subject Selection */}
      {subjects.length > 0 && (
        <>
          <Typography>Select Subject</Typography>
          <Select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              fetchCoSubjects(e.target.value);
            }}
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

      {/* Co-Subject Selection */}
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

          {/* Display Added Co-Subjects */}
          <List>
            {addedCoSubjects.map((id, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={coSubjects.find((c) => c._id === id)?.name}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleRemoveCoSubject(id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Divider />

      {/* Question Input */}
      <Typography>Add a Question</Typography>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options Inputs */}
      {options.map((opt, index) => (
        <TextField
          key={index}
          label={`Option ${index + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}

      {/* Correct Answer Input */}
      <TextField
        label="Correct Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      {/* Add to Local Storage */}
      <Button variant="contained" onClick={handleAddQuestion}>
        Add to Local Storage
      </Button>
      <List>
        {savedQuestions.map((q, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={q.question}
              secondary={`Answer: ${q.answer}`}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleRemoveQuestion(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Submit to Database */}
      <Button variant="contained" color="primary" onClick={handleFinalSubmit}>
        Final Submit
      </Button>
    </Box>
  );
};

export default AddQuestionPage;
