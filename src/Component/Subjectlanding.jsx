import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../CSS/Subjectlanding.css';

function SubjectLanding() {
  const { courseId } = useParams(); // ✅ Correctly extract courseId
  const [activeSection, setActiveSection] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [previousYearPapers, setPreviousYearPapers] = useState([]); // ✅ Store PYQs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          setSubjects(data.subjects || data);
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
        `http://localhost:5000/user/admin/getpreviousyearpapers/${courseId}`
      )
        .then((response) => {
          if (!response.ok)
            throw new Error('this course has no previous year papers');
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

  return (
    <div className="EXAM">
      {/* Section Buttons */}
      <div className="Contect2">
        <div
          className={`box1 ${activeSection === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveSection('topics')}
        >
          <h2>DPP</h2>
        </div>

        <div
          className={`box1 ${activeSection === 'mockTest' ? 'active' : ''}`}
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
      </div>

      {/* Content Box */}
      <div className={`details-box ${activeSection ? 'show' : ''}`}>
        {activeSection === 'topics' && (
          <>
            <h3>📚 Available Subjects</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && subjects.length > 0 ? (
              <ul className="subject-list">
                {subjects.map((subject) => (
                  <Link to={`/viewcosubject/${courseId}/${subject._id}`}>
                    <li key={subject._id}>{subject.name}</li>
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
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && previousYearPapers.length > 0 ? (
              <ul className="pyq-list">
                {previousYearPapers.map((paper) => (
                  <li key={paper._id}>
                    <a href={`/pyq/${paper._id}`}>{paper.name}</a>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && !error && <p>No previous year papers found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SubjectLanding;
