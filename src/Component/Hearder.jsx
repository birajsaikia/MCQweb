import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import '../CSS/Header.css';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuIconRef = useRef(null); // Reference for the hamburger icon

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(
        'https://mc-qweb-backend.vercel.app/user/verify-token',
        { token }
      );
      setIsLoggedIn(response.data.valid);
    } catch (err) {
      console.error('Token verification failed:', err);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/src/view/logo.jpg" alt="" />
        </Link>
      </div>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
        ref={menuIconRef} // Attach ref to the icon
      >
        <i className="fas fa-bars"></i>
      </div>

      {/* Desktop/Nav Links */}
      <nav className={`nav-links ${menuOpen ? 'active' : ''}`} ref={menuRef}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/event">Event</NavLink>
        <NavLink to="/course">Course</NavLink>
        {isLoggedIn ? (
          <>
            <button>
              <NavLink to="/userprofile">Profile</NavLink>
            </button>
            <button>
              <div
                onClick={handleLogout}
                className="logout-btn"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bolder',
                  transition: 'color 0.3s ease',
                }}
              >
                Logout
              </div>
            </button>
          </>
        ) : (
          <button>
            <NavLink to="/login">Login</NavLink>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
