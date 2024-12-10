// src/Components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/elections');
        setElections(response.data);
      } catch (error) {
        console.error('Failed to fetch elections:', error);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li className="menu-item">
            <Link to="/create-election" className="menu-link">Create Election</Link>
          </li>
          <li className="menu-item">
            <h3 className="section-title">Manage Elections</h3>
            <ul className="submenu">
              {elections.map((election) => (
                <li key={election.id} className="submenu-item">
                  <Link to={`/manage-election/${election.id}`} className="submenu-link">
                    {election.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="menu-item">
            <Link to="/create-user" className="menu-link">Create User</Link>
          </li>
          <li className="menu-item">
            <Link to="/view-results" className="menu-link">View Election Results</Link>
          </li>
        </ul>
      </aside>

      <main className="content">
        <h1>Welcome to the Admin Dashboard</h1>
        <p>Manage elections, create new elections, and oversee ongoing activities.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
