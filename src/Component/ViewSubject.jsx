import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';

const ViewSubjectPage = () => {
  const { courseId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/subject/${courseId}`
      );
      setSubjects(response.data.subjects);
    } catch (err) {
      setError('Failed to fetch subjects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: '20px', fontWeight: 'bold' }}
      >
        Subjects for Course
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {subjects.map((subject, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
                background: 'linear-gradient(135deg, #83a4d4, #b6fbff)',
                color: '#fff',
              }}
            >
              <Link to={`/viewcosubject/${courseId}/${subject._id}`}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {subject.name}
                  </Typography>
                  {/* <Typography variant="body2">{subject.description}</Typography> */}
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ViewSubjectPage;
