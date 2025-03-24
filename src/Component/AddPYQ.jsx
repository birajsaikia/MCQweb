import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AddPYQ = () => {
  const [pyqs, setPyqs] = useState([]);
  const [newPYQ, setNewPYQ] = useState({
    year: '',
    name: '',
    Link: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  // Fetch PYQs from the backend
  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/admin/getpreviousyearpapers/${courseId}`
        );

        const formattedPYQs = response.data.map((pyq) => ({
          ...pyq,
          combinedName: `${pyq.name} - ${pyq.year}`,
        }));

        setPyqs(formattedPYQs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchPYQs();
    }
  }, [courseId]);

  // Handle input changes
  const handleChange = (e) => {
    setNewPYQ({ ...newPYQ, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPYQ.year || !newPYQ.name) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const { data } = await axios.post(
        `https://mc-qweb-backend.vercel.app/user/admin/addpreviousyearpaper/${courseId}`,
        newPYQ
      );

      setPyqs([
        ...pyqs,
        {
          name: newPYQ.name,
          year: newPYQ.year,
          combinedName: `${newPYQ.name} - ${newPYQ.year}`,
          _id: data._id, // Assuming the backend returns an _id
        },
      ]);

      setNewPYQ({ year: '', name: '' });

      alert('PYQ Added Successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add PYQ');
    }
  };

  // Handle deleting a PYQ
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PYQ?')) return;

    try {
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/deletepreviousyearpaper/${courseId}/${id}`
      );

      setPyqs(pyqs.filter((pyq) => pyq._id !== id));
      alert('PYQ Deleted Successfully!');
    } catch (error) {
      alert('Failed to delete PYQ');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📚 Previous Year Question Papers</h1>

      {/* Add PYQ Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="year"
            placeholder="Enter Year (e.g., 2023)"
            value={newPYQ.year}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="Link"
            placeholder="Enter dive link"
            value={newPYQ.Link}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={newPYQ.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            ➕ Add PYQ
          </button>
        </div>
      </form>

      {/* Loading/Error Messages */}
      {loading && <p style={styles.message}>Loading PYQs...</p>}
      {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}

      {/* Display Added PYQs */}
      <div style={styles.listContainer}>
        <h2 style={styles.subHeading}>📝 Available PYQs</h2>
        {pyqs.length === 0 ? (
          <p style={styles.message}>No PYQs available.</p>
        ) : (
          <ul style={styles.list}>
            {pyqs.map((pyq) => (
              <li key={pyq._id} style={styles.listItem}>
                <span>{pyq.combinedName}</span>
                <div>
                  <Link to={`/viewpyqquation/${courseId}/${pyq._id}`}>
                    <button style={styles.viewButton}>🔍 View Questions</button>
                  </Link>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(pyq._id)}
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

export default AddPYQ;
