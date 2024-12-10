import React, { useState } from 'react';
import './Register.css';
import Popup from './Popup';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    voterId: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkUniqueField = async (field, value) => {
    try {
      const response = await fetch(`http://localhost:8080/users`);
      const data = await response.json();
      return !data.some(user => user[field] === value); // true if unique
    } catch (error) {
      console.error('Error checking unique field:', error);
      return false; // treat as not unique in case of error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPopupMessage('Passwords do not match!');
      setPopupVisible(true);
      return;
    }

    const fieldsToCheck = [
      { field: 'voterId', value: formData.voterId },
      { field: 'mobile', value: formData.mobile },
      { field: 'email', value: formData.email },
    ];

    for (const { field, value } of fieldsToCheck) {
      const isUnique = await checkUniqueField(field, value);
      if (!isUnique) {
        setPopupMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists!`);
        setPopupVisible(true);
        return;
      }
    }

    // Create new user object without confirmPassword
    const { confirmPassword, ...newUser } = formData;
    newUser.role = 'user'; // Set role to 'user' for all registrations

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setPopupMessage('Registration successful!');
        setPopupVisible(true);
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          gender: '',
          voterId: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        const errorData = await response.json();
        setPopupMessage(`Registration failed: ${errorData.message || 'Unknown error'}`);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setPopupMessage('Network error occurred. Please try again.');
      setPopupVisible(true);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="registerbody06">
      <div className="register-wrapper06">
        <div className="register-container06">
          <form className="register06" onSubmit={handleSubmit}>
            <h2 className="register-title06">Register</h2>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="voterId"
              placeholder="Voter ID"
              value={formData.voterId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile No"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>

            <div className="toggle-option06">
              <p>Already have an account? <a href="/login" className="toggle-link06">Login</a></p>
            </div>
          </form>
        </div>
      </div>
      {popupVisible && <Popup message={popupMessage} onClose={handleClosePopup} />}
    </div>
  );
}

export default Register;
