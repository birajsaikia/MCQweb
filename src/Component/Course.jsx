import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import '../CSS/Course.css';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://mc-qweb-backend.vercel.app/user/admin/course'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </Container>
    );
  }

  return (
    <div className="course-container">
      <h1 className="title">Courses</h1>
      <div className="course-list">
        {courses.map((course) => (
          <Link to={`/viewsubject/${course._id}`} className="course-link">
            <div key={course._id} className="course-card">
              {course.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Course;
