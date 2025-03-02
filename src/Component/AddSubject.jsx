import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const AddSubjectPage = () => {
  const [subjectName, setSubjectName] = useState('');
  const [courseData, setCourseData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [prevYearQuestion, setPrevYearQuestion] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
    fetchSubjects();
  }, [courseId]);

  const verifyToken = async () => {
    console.log('courseId:', courseId);
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
      if (!response.data.valid) {
        setIsTokenValid(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setIsTokenValid(false);
      navigate('/');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/subject/${courseId}`
      );
      setCourseData(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAddSubject = async () => {
    if (subjectName.trim()) {
      try {
        await axios.post(
          `https://mc-qweb-backend.vercel.app/user/admin/addsubject/${courseId}`,
          { name: subjectName },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setSubjectName('');
        fetchSubjects();
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    console.log('Deleting subject:', courseId, subjectId);
    try {
      await axios.delete(
        `http://localhost:5000/user/admin/subject/${courseId}/${subjectId}`
      );

      setCourseData((prevData) => ({
        ...prevData,
        subjects: prevData.subjects.filter((subj) => subj._id !== subjectId),
      }));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleViewcoSubject = (subjectId, subjectName) => {
    navigate(`/course/${courseId}/${subjectName}/cosubject/${subjectId}`);
  };

  const handleViewSubject = (subject) => {
    setSelectedSubject(subject);
  };

  const handleAddPrevYearQuestion = async (subjectId) => {
    if (prevYearQuestion.trim()) {
      try {
        await axios.post(
          `https://mc-qweb-backend.vercel.app/user/admin/previousyear/${courseId}/${subjectId}`,
          { name: prevYearQuestion },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setPrevYearQuestion('');
        fetchSubjects(); // Refresh subjects to show new Previous Year Questions
      } catch (error) {
        console.error('Error adding previous year question:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      {isTokenValid && (
        <div>
          <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
            Add Subjects to Course {courseData.courseName}
          </Typography>
          <Divider sx={{ margin: '16px 0' }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '16px',
            }}
          >
            <TextField
              label="New Subject Name"
              variant="outlined"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <Button variant="contained" onClick={handleAddSubject}>
              Add Subject
            </Button>
          </Box>

          <Typography variant="h5">Subjects</Typography>
          {courseData.subjects && courseData.subjects.length > 0 ? (
            courseData.subjects.map((subject) => (
              <Box
                key={subject._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <Typography>{subject.name}</Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: '8px' }}
                    onClick={() => handleViewSubject(subject)}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginRight: '8px' }}
                    onClick={() =>
                      handleViewcoSubject(subject._id, subject.name)
                    }
                  >
                    View Co-Subjects
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteSubject(subject._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No subjects added yet.</Typography>
          )}

          {/* View Subject Section */}
          {selectedSubject && (
            <Box
              sx={{
                marginTop: '20px',
                padding: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            >
              <Typography variant="h5">
                Subject: {selectedSubject.name}
              </Typography>

              {/* Add Previous Year Questions */}
              <Box sx={{ marginTop: '16px' }}>
                <TextField
                  label="Add Previous Year Question Paper"
                  variant="outlined"
                  value={prevYearQuestion}
                  onChange={(e) => setPrevYearQuestion(e.target.value)}
                  sx={{ marginBottom: '16px', width: '80%' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddPrevYearQuestion(selectedSubject._id)}
                >
                  Add
                </Button>
              </Box>

              <Typography variant="h6" sx={{ marginTop: '16px' }}>
                Previous Year Papers:
              </Typography>
              {selectedSubject.previousyears &&
              selectedSubject.previousyears.length > 0 ? (
                selectedSubject.previousyears.map((paper) => (
                  <Typography key={paper._id} sx={{ padding: '8px 0' }}>
                    📜 {paper.name}
                  </Typography>
                ))
              ) : (
                <Typography>No previous year papers added.</Typography>
              )}
            </Box>
          )}
        </div>
      )}

      {!isTokenValid && (
        <Typography variant="body1" color="error">
          Invalid or expired token. Redirecting to home...
        </Typography>
      )}
    </Box>
  );
};

export default AddSubjectPage;
