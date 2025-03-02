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
  const [courses, setCourses] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [image, setimage] = useState(null);
  const [data, setData] = useState([]);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (selectedContent) {
      fetchData();
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/${selectedContent}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleButtonClick = (content) => {
    setSelectedContent(content);
    setIsAdding(false);
    setNewItem('');
  };

  const onoutputchange = (e) => {
    setimage(e.target.files[0]);
  };

  const handleAddNew = async (e) => {
    e.preventDefault();

    if (!image) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', newItem);

    try {
      await axios.post(
        `https://mc-qweb-backend.vercel.app/user/admin/add-course`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setIsAdding(false);
      setimage(null);
      fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/delate-course/${id}`
      );

      if (response.status === 200) {
        setData((prevData) => prevData.filter((course) => course._id !== id));
      } else {
        throw new Error('Failed to delete course');
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
            Add Quations
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

            {data.length > 0 ? (
              <Grid container spacing={2}>
                {data.map((item) => (
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
                              onClick={() => handleViewPYQ(item._id, item.name)}
                            >
                              View PYQ
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
                <input type="file" onChange={onoutputchange} />
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
