import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/AdminPYQPage.css'; // Import your CSS file

const AdminPYQPage = () => {
  const { courseId, paperId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctOption: '',
  });
  console.log('AdminPYQPage -> courseId', courseId);
  console.log('AdminPYQPage -> paperId', paperId);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/admin/getpreviousyearquestions/${courseId}/${paperId}`
        );
        setQuestions(response.data);
      } catch (error) {
        setError('Failed to fetch questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [paperId, courseId]);

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleAddQuestion = async () => {
    if (
      !newQuestion.question.trim() ||
      newQuestion.options.some((opt) => !opt.trim()) ||
      !newQuestion.correctOption.trim()
    ) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const response = await axios.post(
        `https://mc-qweb-backend.vercel.app/user/admin/addpreviousyearquestion/${courseId}/${paperId}`,
        {
          question: newQuestion.question,
          options: newQuestion.options,
          correctOption: newQuestion.correctOption,
        }
      );

      if (response.status === 201) {
        alert('Question added successfully!');
        setQuestions([...questions, newQuestion]); // ✅ Update state immediately
        setNewQuestion({
          question: '',
          options: ['', '', '', ''],
          correctOption: '',
        });
        setShowForm(false);
      } else {
        alert('Failed to add question.');
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to add question. Please try again.'
      );
    }
  };

  const handleDeleteQuestion = async (index) => {
    try {
      const questionToDelete = questions[index];
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/deletepreviousyearquestion/${questionToDelete._id}`
      );
      alert('Question deleted successfully!');
      window.location.reload();
    } catch (error) {
      alert('Failed to delete question. Please try again.');
    }
  };

  return (
    <div className="admin-pyq-container">
      <h1 className="admin-pyq-title">Admin PYQ Management</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="admin-pyq-toggle-button"
      >
        {showForm ? 'Hide Add Question' : 'Add New Question'}
      </button>

      {showForm && (
        <div className="admin-pyq-form-container">
          <h2 className="admin-pyq-form-title">Add New Question</h2>
          <input
            type="text"
            name="question"
            placeholder="Enter Question"
            value={newQuestion.question}
            onChange={handleChange}
            className="admin-pyq-input"
          />
          {newQuestion.options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="admin-pyq-input"
            />
          ))}
          <select
            name="correctOption"
            value={newQuestion.correctOption}
            onChange={handleChange}
            className="admin-pyq-select"
          >
            <option value="">Select Correct Answer</option>
            {newQuestion.options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <button onClick={handleAddQuestion} className="admin-pyq-save-button">
            Save Question
          </button>
        </div>
      )}

      <h2 className="admin-pyq-list-title">Uploaded Questions</h2>
      {loading ? (
        <p className="admin-pyq-loading">Loading questions...</p>
      ) : error ? (
        <p className="admin-pyq-error">{error}</p>
      ) : questions.length === 0 ? (
        <p className="admin-pyq-no-questions">No questions available.</p>
      ) : (
        <ul className="admin-pyq-question-list">
          {questions.map((q, index) => (
            <li key={index} className="admin-pyq-question-item">
              <strong>Q{index + 1}:</strong> {q.question}
              <ul className="admin-pyq-option-list">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`admin-pyq-option-item ${
                      opt === q.correctOption ? 'admin-pyq-correct-answer' : ''
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleDeleteQuestion(index)}
                className="admin-pyq-delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPYQPage;
