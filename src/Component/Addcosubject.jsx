import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const AddSubjectPage = () => {
  const [subjectName, setSubjectName] = useState('');
  const [getdata, setgetdata] = useState([]);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const { courseId } = useParams();
  const { subjectId } = useParams();
  const { subject } = useParams();
  const { course } = useParams();
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
        `https://mc-qweb-backend.vercel.app/user/admin/cosubject/${courseId}/${subjectId}`
      );
      setgetdata(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAddSubject = async () => {
    if (subjectName.trim()) {
      try {
        await axios.post(
          `https://mc-qweb-backend.vercel.app/user/admin/addcosubject/${courseId}/${subjectId}`,
          { name: subjectName }
        );
        setSubjectName('');
        fetchSubjects();
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  const handleDeleteSubject = async (cosubjectId) => {
    // console.log(`https://mc-qweb-backend.vercel.app/user/admin/cosubject/${courseId}/${subjectId}/${cosubjectId}`)
    try {
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/cosubject/${courseId}/${subjectId}/${cosubjectId}`
      );
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleViewQuation = (cosubjectId, cosubjectname) => {
    navigate(`/quations/${courseId}/${subjectId}/${cosubjectId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      {isTokenValid && (
        <div>
          <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
            Add Co Subject in {course} / {subject} /
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
              Add Co-Subject
            </Button>
          </Box>

          <Typography variant="h5">Co-Subjects</Typography>
          {getdata.cosubject && getdata.cosubject.length > 0 ? (
            getdata.cosubject.map((subject) => (
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
                    onClick={() => handleViewQuation(subject._id, subject.name)}
                  >
                    View Questions
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
            <Typography>No co-subjects added yet.</Typography>
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
