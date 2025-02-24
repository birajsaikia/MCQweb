import React from 'react';
import '../CSS/Home.css';
import benner from '../view/benner.jpg';
import Event from './Event';
import Milestone from './Milestone';
import Footer from './Footer';
import Header from './Hearder';
import Course from './Course';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="container">
        <div className="content">
          <h1>Multiple Choice Questions</h1>
          <h1>With Us.</h1>
          <p>
            MCQweb is an interactive online platform that enhances learning
            through multiple-choice quizzes across various subjects. It offers
            instant feedback, progress tracking, and an engaging experience for
            students and professionals. Whether preparing for exams or improving
            knowledge, MCQweb makes learning fun and effective. Start your
            journey today!
          </p>
          <button className="button">
            <Link to="/course" style={{ color: 'white' }}>
              Try it now
            </Link>
          </button>
        </div>
        <div className="image-container">
          <img src={benner} />
        </div>
      </div>

      <Event />
      <Course />
      {/* <Milestone /> */}
      <Footer />
    </>
  );
};

export default Home;
