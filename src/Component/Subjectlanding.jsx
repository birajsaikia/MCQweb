import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import '../CSS/Subjectlanding.css';

function SubjectLanding() {
  const { courseId } = useParams();
  const [activeSection, setActiveSection] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [previousYearPapers, setPreviousYearPapers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [mockTests, setMockTests] = useState([]); // ✅ Mock Tests state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    setSubjects([]);
    setPreviousYearPapers([]);
    setNotices([]);
    setMockTests([]);
  }, [activeSection]);

  const fetchData = (endpoint, setter, errorMessage) => {
    setLoading(true);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(errorMessage);
        return response.json();
      })
      .then((data) => {
        setter(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (activeSection === 'topics') {
      fetchData(
        `https://mc-qweb-backend.vercel.app/user/admin/subject/${courseId}`,
        setSubjects,
        'This course has no subjects'
      );
    } else if (activeSection === 'previousYear') {
      fetchData(
        `https://mc-qweb-backend.vercel.app/user/admin/getpreviousyearpapers/${courseId}`,
        setPreviousYearPapers,
        'This course has no previous year papers'
      );
    } else if (activeSection === 'notice') {
      fetchData(
        `https://mc-qweb-backend.vercel.app/user/admin/notice/notices/${courseId}`,
        setNotices,
        'No notices available.'
      );
    } else if (activeSection === 'mockTest') {
      fetchData(
        `https://mc-qweb-backend.vercel.app/user/admin/getmocktests/${courseId}`,
        setMockTests,
        'No mock tests available.'
      );
    }
  }, [activeSection, courseId]);

  return (
    <Container className="EXAM">
      <div className="Contect2">
        <div
          className={`box1 ${activeSection === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveSection('topics')}
        >
          <h2>Subjects</h2>
        </div>
        <div
          className={`box1 ${activeSection === 'mockTest' ? 'active' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #56ccf2, #2f80ed)',
            width: '200px',
          }}
          onClick={() => setActiveSection('mockTest')}
        >
          <h2>Mock Test</h2>
        </div>
        <div
          className={`box1 ${activeSection === 'previousYear' ? 'active' : ''}`}
          onClick={() => setActiveSection('previousYear')}
        >
          <h2>PYQ</h2>
        </div>
        <div
          className={`box1 ${activeSection === 'notice' ? 'active' : ''}`}
          onClick={() => setActiveSection('notice')}
        >
          <h2>Notice</h2>
        </div>
      </div>

      <div className={`details-box ${activeSection ? 'show' : ''}`}>
        {activeSection === 'topics' && (
          <>
            <h3>📚 Available Subjects</h3>
            {loading && <CircularProgress />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && subjects.length > 0 ? (
              <ul className="subject-list">
                {subjects.map((subject) => (
                  <li key={subject._id}>{subject.name}</li>
                ))}
              </ul>
            ) : (
              !loading && !error && <p>No subjects found.</p>
            )}
          </>
        )}

        {/* ✅ Mock Test Section - Now showing fetched mock test data */}
        {activeSection === 'mockTest' && (
          <>
            <h3>📝 Available Mock Tests</h3>
            {loading && <CircularProgress />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && mockTests.length > 0 ? (
              <Grid container spacing={3} mt={1}>
                {mockTests.map((test) => (
                  <Link to={`/domocktest/${courseId}/${test._id}`}>
                    <Grid item key={test._id} xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          transition: '0.3s',
                          '&:hover': { transform: 'scale(1.05)' },
                          padding: '10px',
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          textAlign: 'center',
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: '#333' }}
                          >
                            {test.name}
                          </Typography>
                          <Typography variant="subtitle1" color="textSecondary">
                            {test.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Link>
                ))}
              </Grid>
            ) : (
              !loading && !error && <p>No mock tests found.</p>
            )}
          </>
        )}

        {activeSection === 'previousYear' && (
          <>
            <h3>📜 Previous Year Papers</h3>
            {loading && <CircularProgress />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && previousYearPapers.length > 0 ? (
              <Grid container spacing={3} mt={1}>
                {previousYearPapers.map((paper) => (
                  <Grid item key={paper._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        transition: '0.3s',
                        '&:hover': { transform: 'scale(1.05)' },
                        padding: '10px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        textAlign: 'center',
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'bold', color: '#333' }}
                        >
                          {paper.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          Year: {paper.year}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              !loading && !error && <p>No previous year papers found.</p>
            )}
          </>
        )}
      </div>
    </Container>
  );
}

export default SubjectLanding;
