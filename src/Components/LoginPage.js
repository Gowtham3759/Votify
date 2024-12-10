// src/Components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import Popup from './Popup';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // State to toggle between user and admin
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Set the correct endpoint based on user type
      const endpoint = isAdmin ? 'http://localhost:8080/admins' : 'http://localhost:8080/users';
      const response = await axios.get(endpoint);
      const users = response.data;

      // Debugging: Log the response data
      console.log("Fetched users:", users);

      // Check if user credentials are valid
      const user = users.find(u => u.email === email && u.password === password);

      // Debugging: Log the found user
      console.log("Logged-in user:", user);

      if (user) {
        setPopupMessage('Login Successful!');
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in local storage

        // Navigate to the appropriate dashboard
        if (isAdmin) {
          navigate('/admin'); // Admin dashboard
        } else {
          navigate('/userdashboard'); // User dashboard
        }
      } else {
        setPopupMessage('Login Failed: Invalid email or password.');
      }
    } catch (error) {
      console.error("Error during login:", error);
      setPopupMessage('Login Failed: An error occurred. Please try again.');
    } finally {
      setPopupVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const toggleLoginType = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className='loginbody05'>
      <div className="login-wrapper05">
        <div className="login-container05">
          <form className="login05" onSubmit={handleLogin}>
            <h2 className="login-title05">{isAdmin ? 'Welcome back Admin' : 'Welcome back User'}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button id='loginbut05' type="submit">Login</button>
            <div className="toggle-option05">
              <p onClick={toggleLoginType} className="login-toggle-link05">
                {isAdmin ? 'Are you a user? Click here' : 'Are you an admin? Click here'}
              </p>
            </div>
            <p className="register-option05">
              Don't have an account? <Link to="/register" className="register-link05">Register here</Link>
            </p>
          </form>
          {popupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
