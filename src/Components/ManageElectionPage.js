import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageElectionPage.css';

const ManageElectionPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState({ name: '', date: '', parties: [], participants: [] });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newParty, setNewParty] = useState({ name: '', candidate: '' });
  const [showPartyFields, setShowPartyFields] = useState(false);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/elections/${electionId}`);
        const fetchedElection = {
          ...response.data,
          participants: response.data.participants || []
        };
        setElection(fetchedElection);
      } catch (err) {
        setError('Failed to fetch election details.');
      }
    };

    fetchElection();
  }, [electionId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElection((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/elections/${electionId}`, election);
      navigate('/admin');
    } catch (err) {
      setError('Failed to update election.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/elections/${electionId}`);
      navigate('/admin');
    } catch (err) {
      setError('Failed to delete election.');
    }
  };

  const handleParticipantChange = (userId) => {
    setElection((prev) => {
      const isParticipant = prev.participants?.includes(userId);
      const newParticipants = isParticipant
        ? prev.participants.filter(id => id !== userId)
        : [...(prev.participants || []), userId];

      return { ...prev, participants: newParticipants };
    });
  };

  const handlePartyChange = (index, field, value) => {
    const updatedParties = election.parties.map((party, i) => {
      if (i === index) {
        return { ...party, [field]: value };
      }
      return party;
    });
    setElection((prev) => ({ ...prev, parties: updatedParties }));
  };

  const addParty = () => {
    if (newParty.name && newParty.candidate) {
      setElection((prev) => ({
        ...prev,
        parties: [...prev.parties, { name: newParty.name, candidate: newParty.candidate }]
      }));
      setNewParty({ name: '', candidate: '' });
      setShowPartyFields(false);
    }
  };

  const handleSelectAll = () => {
    if (election.participants.length === users.length) {
      setElection((prev) => ({ ...prev, participants: [] }));
    } else {
      const allUserIds = users.map(user => user.id);
      setElection((prev) => ({ ...prev, participants: allUserIds }));
    }
  };

  const renderParties = () => {
    return election.parties.map((party, index) => (
      <div className="party-input-group" key={index}>
        <div>
          <label>Party Name:</label>
          <input
            type="text"
            className="input-field"
            value={party.name}
            onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
            placeholder="Party Name"
            required
          />
        </div>
        <div>
          <label>Candidate Name:</label>
          <input
            type="text"
            className="input-field"
            value={party.candidate}
            onChange={(e) => handlePartyChange(index, 'candidate', e.target.value)}
            placeholder="Candidate Name"
            required
          />
        </div>
      </div>
    ));
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="manage-election-container">
      <div className="election-card">
        <h1 className="header">Manage Election</h1>
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label>Election Name:</label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={election.name}
              onChange={handleChange}
              placeholder="Election Name"
              required
            />
          </div>

          <div className="input-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              className="input-field"
              value={election.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <h3>Parties and Candidates:</h3>
            {renderParties()}
          </div>

          <div className="input-group">
            <button type="button" className="btn-add-party" onClick={() => setShowPartyFields(!showPartyFields)}>
              {showPartyFields ? 'Cancel' : 'Add New Party'}
            </button>

            {showPartyFields && (
              <div className="party-input-group">
                <div>
                  <label>Party Name:</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    placeholder="Party Name"
                    required
                  />
                </div>
                <div>
                  <label>Candidate Name:</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newParty.candidate}
                    onChange={(e) => setNewParty({ ...newParty, candidate: e.target.value })}
                    placeholder="Candidate Name"
                    required
                  />
                </div>
                <button type="button" className="btn-add-party" onClick={addParty}>Add Party</button>
              </div>
            )}
          </div>

          <div className="input-group">
            <h3>Select Participants:</h3>
            <button type="button" className="btn-select-all" onClick={handleSelectAll}>
              {election.participants.length === users.length ? 'Deselect All' : 'Select All Users'}
            </button>
            <table className="participants-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={election.participants?.includes(user.id)}
                        onChange={() => handleParticipantChange(user.id)}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-save">Save Changes</button>
            <button type="button" className="btn-delete" onClick={handleDelete}>Delete Election</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageElectionPage;
