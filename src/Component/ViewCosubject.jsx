import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';

const ViewCoSubject = () => {
  const { courseId, subjectId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, [courseId, subjectId]); // Added courseId and subjectId as dependencies

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `https://mc-qweb-backend.vercel.app/user/admin/cosubject/${courseId}/${subjectId}`
      );
      setSubjects(response.data.cosubject);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subjects');
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
        Co-Subject for the Subject
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {Array.isArray(subjects) && subjects.length > 0 ? (
          subjects.map((subject, index) => (
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
                <Link
                  to={`/coursequation/${courseId}/${subjectId}/${subject._id}`}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {subject.name}
                    </Typography>
                    {/* <Typography variant="body2">{subject.description}</Typography> */}
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No subjects found</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ViewCoSubject;
