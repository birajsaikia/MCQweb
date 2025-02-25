import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Container, Typography } from '@mui/material';
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
          <Link
            to={`/viewsubject/${course._id}`}
            key={course._id}
            className="course-card"
            style={{
              width: '130px',
              border: '3px solid #2d3e37',
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '40px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                border: '3px solid #2d3e37',
                borderRadius: '50%',
                margin: '-70px 0 20px 0',
                overflow: 'hidden',
                display: 'flex',
                color: '#393b4b',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/src/view/SSC.jpg"
                alt={course.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            <h3>{course.name}</h3>
            <p
              style={{
                fontSize: '0.8rem',
                textAlign: 'center',
                width: '90%',
                lineHeight: '1.2rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              mocktest, previous years papers and DPP
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Course;
