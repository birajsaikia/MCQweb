import React from 'react';
import '../CSS/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h1 className="h1">MCQ.</h1>
        <p className="footer-description">
          MCQweb is an interactive learning platform offering multiple-choice
          quizzes across various subjects. It helps students and professionals
          improve their knowledge through instant feedback, progress tracking,
          and engaging assessments. Prepare for exams and enhance your skills
          with MCQweb today!
        </p>
        <div className="social-icons">
          <a href="#" className="icon">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="icon">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
      <div className="footer-center">
        <h2 className="h1">Contact Us</h2>
        <p className="footer-contact">
          <i className="fas fa-phone-alt"></i> +911111111111 Support Number
        </p>
        <p className="footer-contact">
          <i className="fas fa-envelope"></i> aaaaa@gmail.com Support Email
        </p>
        <p className="footer-contact">
          <i className="fas fa-map-marker-alt"></i> Guwahati, Assam Address
        </p>
      </div>
      <div className="footer-right">
        <h2 className="h1">Page</h2>
        <p className="footer-contact">
          <Link to="/about" style={{ color: '#fff', fontWeight: 'normal' }}>
            <i className="fas fa-info-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp; About
            Page
          </Link>
        </p>
        <p className="footer-contact">
          <Link to="/course" style={{ color: '#fff', fontWeight: 'normal' }}>
            <i className="fas fa-book"></i>&nbsp;&nbsp;&nbsp;&nbsp; Course Page
          </Link>
        </p>
        <p className="footer-contact">
          <Link to="/event" style={{ color: '#fff', fontWeight: 'normal' }}>
            <i className="fas fa-calendar-alt"> </i>&nbsp;&nbsp;&nbsp;&nbsp;
            Event Page{' '}
          </Link>
        </p>
        <p className="footer-contact">
          <Link
            to="/userprofile"
            style={{ color: '#fff', fontWeight: 'normal' }}
          >
            {' '}
            <i className="fas fa-user"></i>&nbsp;&nbsp;&nbsp;&nbsp; Profile Page
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
