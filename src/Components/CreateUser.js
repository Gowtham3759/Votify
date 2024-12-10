// src/Components/CreateUser.js
import React, { useState } from 'react';
import axios from 'axios';
import './CreateUser.css'; // Add appropriate CSS for styling

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user', // Default to 'user'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to create the user
      await axios.post('http://localhost:8080/users', formData);
      setSuccess('User created successfully.');
      // Reset form data after successful creation
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user', // Reset role to default
      });
    } catch (error) {
      setError('Failed to create user.');
    }
  };

  return (
    <div className="create-user">
      <h1>Create User</h1>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* Removed the role selection dropdown */}
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
