import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';

const Admin = () => {
  const [selectedContent, setSelectedContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [image, setImage] = useState(null);
  const [events, setEvents] = useState([]); // State for events
  const [courses, setCourses] = useState([]); // State for courses
  const [milestones, setMilestones] = useState([]); // State for milestones
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (selectedContent) {
      fetchData(selectedContent);
    }
  }, [selectedContent]);

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
      console.error('Error verifying token:', error);
      setIsTokenValid(false);
      navigate('/');
    }
  };

  const fetchData = async (content) => {
    try {
      let endpoint;
      if (content === 'event') {
        endpoint = 'https://mc-qweb-backend.vercel.app/user/useevent/events';
      } else if (content === 'course') {
        endpoint = 'https://mc-qweb-backend.vercel.app/user/admin/course';
      } else if (content === 'milestone') {
        endpoint = 'https://mc-qweb-backend.vercel.app/user/admin/milestone';
      } else {
        console.error('Invalid content type');
        return;
      }

      const response = await axios.get(endpoint);
      console.log('Fetched Data for', content, ':', response.data); // Debugging line

      // Update the corresponding state variable
      if (content === 'event') {
        setEvents(response.data);
      } else if (content === 'course') {
        setCourses(response.data);
      } else if (content === 'milestone') {
        setMilestones(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleButtonClick = (content) => {
    console.log('Selected Content:', content); // Debugging line
    setSelectedContent(content);
    setIsAdding(false);
    setNewItem('');
    setDescription('');
    setTime('');
    setImage(null);
  };

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddNew = async (e) => {
    e.preventDefault();

    if (
      selectedContent === 'event' &&
      (!image || !newItem || !description || !time)
    ) {
      console.error('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', newItem);

    if (selectedContent === 'event') {
      formData.append('description', description);
      formData.append('time', time);
    }

    try {
      let endpoint;
      if (selectedContent === 'event') {
        endpoint = 'https://mc-qweb-backend.vercel.app/user/useevent/events';
      } else if (selectedContent === 'course') {
        endpoint = ' http://localhost:5000/user/admin/add-course';
      } else if (selectedContent === 'milestone') {
        endpoint =
          'https://mc-qweb-backend.vercel.app/user/admin/add-milestone';
      }

      console.log('Sending request to:', endpoint); // Debugging line
      console.log('Form Data:', formData); // Debugging line

      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Response:', response.data); // Debugging line

      // Reset form fields
      setIsAdding(false);
      setImage(null);
      setNewItem('');
      setDescription('');
      setTime('');

      // Refetch data to update the UI
      fetchData(selectedContent);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      let endpoint;
      if (selectedContent === 'event') {
        endpoint = `https://mc-qweb-backend.vercel.app/user/useevent/events/${id}`;
      } else if (selectedContent === 'course') {
        endpoint = `https://mc-qweb-backend.vercel.app/user/admin/delate-course/${id}`;
      } else if (selectedContent === 'milestone') {
        endpoint = `https://mc-qweb-backend.vercel.app/user/admin/delete-milestone/${id}`;
      }

      const response = await axios.delete(endpoint);

      if (response.status === 200) {
        // Update the corresponding state variable
        if (selectedContent === 'event') {
          setEvents((prevData) => prevData.filter((item) => item._id !== id));
        } else if (selectedContent === 'course') {
          setCourses((prevData) => prevData.filter((item) => item._id !== id));
        } else if (selectedContent === 'milestone') {
          setMilestones((prevData) =>
            prevData.filter((item) => item._id !== id)
          );
        }
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewSubjects = (courseId, coursename) => {
    navigate(`/${coursename}/addsubject/${courseId}`);
  };

  const handleViewPYQ = (courseId, coursename) => {
    navigate(`/${coursename}/addpyq/${courseId}`);
  };
  const handleViewNotice = (courseId, coursename) => {
    navigate(`/addnotice/${courseId}`);
  };

  const handleViewMT = (courseId, coursename) => {
    navigate(`/${coursename}/addmocktest/${courseId}`);
  };

  // Get the data for the selected section
  const getDataForSelectedContent = () => {
    if (selectedContent === 'event') {
      return events;
    } else if (selectedContent === 'course') {
      return courses;
    } else if (selectedContent === 'milestone') {
      return milestones;
    }
    return [];
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          width: { xs: '100%', sm: '200px' },
          backgroundColor: '#f4f4f4',
          padding: '16px',
        }}
      >
        <h1>Admin Page</h1>
        <a href="/addquation">
          <Button
            fullWidth
            variant="contained"
            sx={{ marginBottom: '8px', marginTop: '12px' }}
          >
            Add Questions
          </Button>
        </a>
        {['event', 'milestone', 'course'].map((section) => (
          <Button
            key={section}
            fullWidth
            variant="contained"
            onClick={() => handleButtonClick(section)}
            sx={{ marginBottom: '8px', marginTop: '12px' }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        ))}
      </Box>

      <Box sx={{ flex: 1, padding: '16px' }}>
        {isTokenValid && selectedContent && (
          <div>
            <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
              {selectedContent}
            </Typography>
            <Divider sx={{ margin: '16px 0' }} />

            {getDataForSelectedContent().length > 0 ? (
              <Grid container spacing={2}>
                {getDataForSelectedContent().map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography>{item.name}</Typography>
                      <Box>
                        {selectedContent === 'event' && (
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ marginRight: '8px', marginTop: '8px' }}
                            onClick={() =>
                              navigate(`/eventquation/${item._id}`)
                            } // Redirect to add question page
                          >
                            Add Questions
                          </Button>
                        )}
                        {selectedContent === 'course' && (
                          <>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ marginRight: '8px' }}
                              onClick={() =>
                                handleViewSubjects(item._id, item.name)
                              }
                            >
                              View Subjects
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ marginRight: '8px', marginTop: '8px' }}
                              onClick={() => handleViewMT(item._id, item.name)}
                            >
                              View Mocktest
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ marginRight: '8px', marginTop: '8px' }}
                              onClick={() => handleViewPYQ(item._id, item.name)}
                            >
                              View PYQ
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ marginRight: '8px', marginTop: '8px' }}
                              onClick={() => handleViewNotice(item._id)}
                            >
                              Notice
                            </Button>
                          </>
                        )}
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No {selectedContent} added yet.</Typography>
            )}

            {!isAdding ? (
              <Button
                variant="contained"
                sx={{ marginTop: '16px' }}
                onClick={() => setIsAdding(true)}
              >
                Add New {selectedContent}
              </Button>
            ) : (
              <form onSubmit={handleAddNew} encType="multipart/form-data">
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setNewItem(e.target.value)}
                />
                {selectedContent === 'event' && (
                  <>
                    <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                      label="Time (in minutes)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="number"
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </>
                )}
                <input type="file" onChange={onImageChange} />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ marginTop: '16px' }}
                >
                  Add
                </Button>
              </form>
            )}
          </div>
        )}

        {!selectedContent && isTokenValid && (
          <Typography variant="body1">
            Please select an option from the left menu.
          </Typography>
        )}

        {!isTokenValid && (
          <Typography variant="body1" color="error">
            Invalid or expired token. Redirecting to home...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Admin;
