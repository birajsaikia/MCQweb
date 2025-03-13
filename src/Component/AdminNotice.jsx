import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';

const AdminNoticePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Verify Admin Token
  useEffect(() => {
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

        if (!response.data.valid) {
          setIsTokenValid(false);
          navigate('/');
        } else {
          setIsTokenValid(true);
          fetchNotices();
        }
      } catch (error) {
        console.error('Error verifying admin token:', error);
        setIsTokenValid(false);
        navigate('/');
      }
    };

    verifyToken();
  }, [navigate]);

  // ✅ Fetch existing notices
  const fetchNotices = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/notice/notices/${courseId}`
      );
      setNotices(response.data.notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  // ✅ Handle file selection
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // ✅ Send data as a JSON object (no FormData needed)
      const response = await axios.post(
        `https://mc-qweb-backend.vercel.app/user/admin/notice/notices/${courseId}`,
        {
          description,
          link,
          date: new Date(), // ✅ Ensure date is properly formatted
        },
        {
          headers: { 'Content-Type': 'application/json' }, // ✅ Send as JSON
        }
      );

      setNotices([...notices, response.data.notice]); // ✅ Update UI
      setDescription('');
      setLink('');
    } catch (error) {
      console.error('Failed to add notice:', error);
      setError('Failed to add notice');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete notice
  const handleDelete = async (noticeId) => {
    try {
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/notice/notices/${courseId}/${noticeId}`
      );
      setNotices(notices.filter((notice) => notice._id !== noticeId));
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  if (isTokenValid === null) {
    return (
      <Container
        sx={{
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

  if (!isTokenValid) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Notice
      </Typography>

      {/* ✅ Notice Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Link (Optional)"
          fullWidth
          margin="normal"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Notice'}
        </Button>
      </form>

      {/* ✅ Display Existing Notices */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Previous Notices
      </Typography>
      {notices.length === 0 ? (
        <Typography>No notices available.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>Link</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice._id}>
                  <TableCell>
                    {new Date(notice.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{notice.description}</TableCell>
                  <TableCell>
                    {notice.link ? (
                      <a
                        href={notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Link
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(notice._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminNoticePage;
