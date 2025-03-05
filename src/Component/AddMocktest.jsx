import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AddMockTest = () => {
  const { courseId } = useParams();
  const [mockTests, setMockTests] = useState([]);
  const [newMockTest, setNewMockTest] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Mock Tests from the backend
  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/admin/getmocktests/${courseId}`
        );
        setMockTests(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchMockTests();
    }
  }, [courseId]);

  // Handle input changes
  const handleChange = (e) => {
    setNewMockTest({ ...newMockTest, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMockTest.name) {
      alert('Please enter the Mock Test name!');
      return;
    }

    try {
      const { data } = await axios.post(
        `https://mc-qweb-backend.vercel.app/user/admin/addmocktest/${courseId}`,
        newMockTest
      );

      setMockTests([
        ...mockTests,
        { name: newMockTest.name, _id: data.mockTest._id },
      ]);
      setNewMockTest({ name: '' });

      alert('Mock Test Added Successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add Mock Test');
    }
  };

  // Handle deleting a Mock Test
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Mock Test?'))
      return;

    try {
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/deletemocktest/${courseId}/${id}`
      );

      setMockTests(mockTests.filter((mockTest) => mockTest._id !== id));
      alert('Mock Test Deleted Successfully!');
    } catch (error) {
      alert('Failed to delete Mock Test');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 Mock Test Management</h1>

      {/* Add Mock Test Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="name"
            placeholder="Enter Mock Test Name"
            value={newMockTest.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            ➕ Add Mock Test
          </button>
        </div>
      </form>

      {/* Loading/Error Messages */}
      {loading && <p style={styles.message}>Loading Mock Tests...</p>}
      {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}

      {/* Display Added Mock Tests */}
      <div style={styles.listContainer}>
        <h2 style={styles.subHeading}>📌 Available Mock Tests</h2>
        {mockTests.length === 0 ? (
          <p style={styles.message}>No Mock Tests available.</p>
        ) : (
          <ul style={styles.list}>
            {mockTests.map((mockTest) => (
              <li key={mockTest._id} style={styles.listItem}>
                <span>{mockTest.name}</span>
                <div>
                  <Link to={`/viewmocktestquation/${courseId}/${mockTest._id}`}>
                    <button style={styles.viewButton}>🔍 View Questions</button>
                  </Link>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(mockTest._id)}
                  >
                    ❌ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    color: '#31473a',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '20px',
    color: '#555',
    textAlign: 'left',
    marginBottom: '10px',
  },
  form: {
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    flex: '1',
  },
  button: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: '0.3s',
  },
  listContainer: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    fontSize: '16px',
  },
  viewButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginRight: '5px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  message: {
    fontSize: '16px',
    color: '#666',
  },
};

export default AddMockTest;
