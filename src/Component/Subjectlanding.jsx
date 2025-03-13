import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Reset states when changing section
  useEffect(() => {
    setLoading(false);
    setError(null);
    setSubjects([]);
    setPreviousYearPapers([]);
    setNotices([]);
  }, [activeSection]);

  // ✅ Fetch subjects when DPP is clicked
  useEffect(() => {
    if (activeSection === 'topics') {
      setLoading(true);
      fetch(`https://mc-qweb-backend.vercel.app/user/admin/subject/${courseId}`)
        .then((response) => {
          if (!response.ok) throw new Error('This course has no subjects');
          return response.json();
        })
        .then((data) => {
          setSubjects(data.subjects || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeSection, courseId]);

  // ✅ Fetch Previous Year Papers when PYQ is clicked
  useEffect(() => {
    if (activeSection === 'previousYear') {
      setLoading(true);
      fetch(
        `https://mc-qweb-backend.vercel.app/user/admin/getpreviousyearpapers/${courseId}`
      )
        .then((response) => {
          if (!response.ok)
            throw new Error('This course has no previous year papers');
          return response.json();
        })
        .then((data) => {
          setPreviousYearPapers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeSection, courseId]);

  // ✅ Fetch Notices when Notice is clicked
  useEffect(() => {
    if (activeSection === 'notice') {
      setLoading(true);
      fetch(`http://localhost:5000/user/admin/notice/notices/${courseId}`)
        .then((response) => {
          if (!response.ok) throw new Error('No notices available.');
          return response.json();
        })
        .then((data) => {
          setNotices(data.notices || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeSection, courseId]);

  return (
    <Container className="EXAM">
      {/* Section Buttons */}
      <div className="Contect2">
        <div
          className={`box1 ${activeSection === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveSection('topics')}
        >
          <h2>DPP</h2>
        </div>
        <Link to={`/mocktest/${courseId}`}>
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
        </Link>
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

      {/* Content Box */}
      <div className={`details-box ${activeSection ? 'show' : ''}`}>
        {activeSection === 'topics' && (
          <>
            <h3>📚 Available Subjects</h3>
            {loading && <CircularProgress />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && subjects.length > 0 ? (
              <ul className="subject-list">
                {subjects.map((subject) => (
                  <Link
                    key={subject._id}
                    to={`/viewcosubject/${courseId}/${subject._id}`}
                  >
                    <li>{subject.name}</li>
                  </Link>
                ))}
              </ul>
            ) : (
              !loading && !error && <p>No subjects found.</p>
            )}
          </>
        )}

        {activeSection === 'mockTest' && (
          <p>📝 Mock Test Content Appears Here</p>
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
                    <Link
                      to={`/pyqquation/${paper.name}/${paper.year}/${courseId}/${paper._id}`}
                      style={{ textDecoration: 'none' }}
                    >
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
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            Year: {paper.year}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            ) : (
              !loading && !error && <p>No previous year papers found.</p>
            )}
          </>
        )}

        {/* Notices Section */}
        {activeSection === 'notice' && (
          <>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#d32f2f',
                marginBottom: '15px',
              }}
            >
              📢 Notices
            </Typography>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && notices.length > 0 ? (
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12}>
                  <Card
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      padding: '20px',
                      textAlign: 'center',
                      width: { xs: '90%', md: '95%' }, // ✅ Full width fix
                      transition: '0.3s',
                      '&:hover': { transform: 'scale(1.03)' },
                    }}
                  >
                    <CardContent>
                      {notices.map((notice) => (
                        <div key={notice._id} style={{ marginBottom: '20px' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              color: '#333',
                              marginBottom: '8px',
                            }}
                          >
                            📢 {notice.description}
                          </Typography>

                          {/* Open Link Button */}
                          {notice.link && (
                            <a
                              href={
                                notice.link.startsWith('http')
                                  ? notice.link
                                  : `https://${notice.link}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block',
                                textDecoration: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                transition: 'background 0.3s ease',
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#0056b3')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#007bff')
                              }
                            >
                              🔗 Open Link
                            </a>
                          )}

                          {/* Notice Date */}
                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#777', marginTop: '10px' }}
                          >
                            📅 Date:{' '}
                            {new Date(notice.date).toLocaleDateString()}
                          </Typography>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              !loading && !error && <Typography>No notices found.</Typography>
            )}
          </>
        )}
      </div>
    </Container>
  );
}

export default SubjectLanding;
