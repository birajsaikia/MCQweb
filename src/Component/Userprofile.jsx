import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../CSS/Userprofile.css';
import Header from './Hearder';
import Footer from './Footer';
import Course from './Course';
import ProfilePic from '../view/user.png';

const Userprofile = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [totalAttendedQuestions, setTotalAttendedQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details after token verification and profile fetch
  useEffect(() => {
    const token = Cookies.get('auth_token'); // Get the token from cookies
    if (!token) {
      console.warn('User is not logged in. Redirecting to login page...');
      navigate('/login', { replace: true });
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          'https://mc-qweb-backend.vercel.app/user/verify-token',
          { token }
        );
        setEmail(response.data.email); // Store the email after token verification
        if (!response.data.valid) {
          console.warn('Invalid token. Redirecting to login...');
          navigate('/login', { replace: true });
          return;
        }

        // Fetch user profile data
        await fetchUserProfile(response.data.email);
        setLoading(false); // Token is valid, continue loading the user profile
      } catch (error) {
        console.error('Error verifying token:', error);
        setError('Error verifying token.');
        setLoading(false);
      }
    };

    const fetchUserProfile = async (email) => {
      try {
        const response = await axios.post(
          'https://mc-qweb-backend.vercel.app/user/viewuserprofile', // API to fetch user profile
          { email }
        );
        setUsername(response.data.profile.username);
        setTotalAttendedQuestions(response.data.profile.totalAttendedQuestions);
        setCorrectAnswers(response.data.profile.correctAnswers);
        setReferralCode(response.data.profile.referralCode); // Set referral code
        setReferralCount(response.data.profile.referralCount); // Set referral count
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Error fetching profile data.');
      }
    };

    verifyToken();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const average =
    totalAttendedQuestions > 0
      ? ((correctAnswers / totalAttendedQuestions) * 100).toFixed(2)
      : 0;

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* <Header /> */}
      <div className="dashboard-container">
        <div className="content1">
          <div className="profile-section">
            <div className="profile-pic">
              <img src={ProfilePic} alt="" style={{ width: '100%' }} />
            </div>

            <div className="profile-info">
              <label className="profile-label">Username :</label>
              <h3 className="profile-name">{username}</h3>
            </div>

            <div className="profile-info">
              <label className="profile-label">Email :</label>
              <p className="profile-email">{email}</p>
            </div>

            <div>
              <button className="edit-profile">Edit Your Profile</button>
            </div>
          </div>

          <div className="account-info">
            <h2>About Your Account</h2>
            <div className="stats">
              <div className="stat-box">
                Total Question Attempt <br></br>
                <span>{totalAttendedQuestions}</span>{' '}
                {/* Display total attended questions */}
              </div>
              <div className="stat-box">
                Total Questions Right <br></br>
                <span>{correctAnswers}</span> {/* Display correct answers */}
              </div>
              <div className="stat-box">
                Average<br></br> <span>{average}</span>
              </div>
              <div className="stat-box">
                Total Events Attempted <br></br>
                <span>00</span>
              </div>
              <div className="stat-box">
                <h2>Refer and Earn</h2>
                <p>
                  Share your referral code with friends and earn rewards. Your
                  referral link is:
                </p>
                <div className="referral-code">
                  <span>
                    https://mc-qweb-backend.vercel.app/signup/{referralCode}
                  </span>
                  <button
                    className="copy-btn"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://mc-qweb-backend.vercel.app/signup/${referralCode}`
                      )
                    }
                  >
                    Copy link
                  </button>
                </div>
                <p>
                  You have referred <strong>{referralCount}</strong> people.
                </p>
              </div>
            </div>
          </div>

          {/* Refer and Earn Section */}
          {/* <div className="referral-section">
            <h2>Refer and Earn</h2>
            <p>
              Share your referral code with friends and earn rewards. Your
              referral code is:
            </p>
            <div className="referral-code">
              <span>{referralCode}</span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(referralCode)}
              >
                Copy Referral Code
              </button>
            </div>
            <p>
              You have referred <strong>{referralCount}</strong> people.
            </p>
          </div> */}
        </div>
      </div>
      <Course />
      <Footer />
    </>
  );
};

export default Userprofile;
