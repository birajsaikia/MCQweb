import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/viewmocktest.css';

const ViewMockTestQuestions = () => {
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://mc-qweb-backend.vercel.app/user/admin/getmocktestquestions/${courseId}/${paperId}`
        );

        console.log('Fetched Questions:', response.data); // Debugging line

        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          setQuestions([]); // Prevents undefined issue
        }
      } catch (error) {
        setError('Failed to fetch questions. Please try again.');
        setQuestions([]); // Ensures questions is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [paperId, courseId]);

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
        `https://mc-qweb-backend.vercel.app/user/admin/addmocktestquestion/${courseId}/${paperId}`,
        {
          question: newQuestion.question,
          options: newQuestion.options,
          correctOption: newQuestion.correctOption,
        }
      );

      if (response.status === 201) {
        alert('Question added successfully!');
        setQuestions([...questions, response.data]); // Use response data to get _id
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

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `https://mc-qweb-backend.vercel.app/user/admin/deletemocktestquestion/${courseId}/${paperId}/${questionId}`
      );
      alert('Question deleted successfully!');
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (error) {
      alert('Failed to delete question. Please try again.');
    }
  };

  return (
    <div className="admin-mocktest-container">
      <h1 className="admin-mocktest-title">Mock Test Questions Management</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="admin-mocktest-toggle-button"
      >
        {showForm ? 'Hide Add Question' : 'Add New Question'}
      </button>

      {showForm && (
        <div className="admin-mocktest-form-container">
          <h2 className="admin-mocktest-form-title">Add New Question</h2>
          <input
            type="text"
            name="question"
            placeholder="Enter Question"
            value={newQuestion.question}
            onChange={handleChange}
            className="admin-mocktest-input"
          />
          {newQuestion.options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="admin-mocktest-input"
            />
          ))}
          <select
            name="correctOption"
            value={newQuestion.correctOption}
            onChange={handleChange}
            className="admin-mocktest-select"
          >
            <option value="">Select Correct Answer</option>
            {newQuestion.options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddQuestion}
            className="admin-mocktest-save-button"
          >
            Save Question
          </button>
        </div>
      )}

      <h2 className="admin-mocktest-list-title">Uploaded Questions</h2>
      {loading ? (
        <p className="admin-mocktest-loading">Loading questions...</p>
      ) : error ? (
        <p className="admin-mocktest-error">{error}</p>
      ) : questions.length === 0 ? (
        <p className="admin-mocktest-no-questions">No questions available.</p>
      ) : (
        <ul className="admin-mocktest-question-list">
          {questions.map((q) => (
            <li key={q._id} className="admin-mocktest-question-item">
              <strong>{q.question}</strong>
              <ul className="admin-mocktest-option-list">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`admin-mocktest-option-item ${
                      opt === q.correctOption
                        ? 'admin-mocktest-correct-answer'
                        : ''
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleDeleteQuestion(q._id)}
                className="admin-mocktest-delete-button"
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

export default ViewMockTestQuestions;
