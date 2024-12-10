import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserId(user.id);
      fetchElections(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchElections = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/elections');
      const userElections = response.data.filter(election =>
        election.participants.includes(userId)
      );
      setElections(userElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const handleVoteNow = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  return (
    <div className="dashboard-body07">
      <div className="dashboard-container07">
        <h1 className="dashboard-title07">User Dashboard</h1>
        <h2>Your Elections</h2>
        <div className="election-container07">
          {elections.length > 0 ? (
            elections.map(election => (
              <div key={election.id} className="election-card07">
                <h3>{election.name}</h3>
                <p>Date: {new Date(election.date).toLocaleDateString()}</p>
                <button onClick={() => handleVoteNow(election.id)} className="vote-button07">
                  Vote Now!
                </button>
              </div>
            ))
          ) : (
            <p>No elections available for you.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
