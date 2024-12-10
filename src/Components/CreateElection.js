// src/Components/CreateElection.js
import React, { useState } from 'react';
import axios from 'axios';
import './CreateElection.css'; // Ensure to import the CSS file

const CreateElection = () => {
  const [electionName, setElectionName] = useState('');
  const [electionDate, setElectionDate] = useState('');
  const [parties, setParties] = useState([{ name: '', candidate: '' }]); // Initialize with one party and candidate

  const handlePartyChange = (index, field, value) => {
    const updatedParties = [...parties];
    updatedParties[index][field] = value; // Update either name or candidate
    setParties(updatedParties);
  };

  const handleAddParty = () => {
    setParties([...parties, { name: '', candidate: '' }]); // Add a new party with empty name and candidate
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const electionData = {
      name: electionName,
      date: electionDate,
      parties: parties.filter(party => party.name !== '' && party.candidate !== ''), // Filter out empty parties
      participants: [], // You can set participants here as needed
    };

    try {
      await axios.post('http://localhost:8080/elections', electionData); // Adjust your API endpoint
      alert('Election created successfully!');
      // Optionally, reset the form after successful submission
      setElectionName('');
      setElectionDate('');
      setParties([{ name: '', candidate: '' }]); // Reset parties to initial state
    } catch (error) {
      alert('Error creating election: ' + error.message);
    }
  };

  return (
    <div className="create-election">
      <h2>Create Election</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Election Name:</label>
          <input 
            type="text" 
            value={electionName} 
            onChange={(e) => setElectionName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Election Date:</label>
          <input 
            type="date" 
            value={electionDate} 
            onChange={(e) => setElectionDate(e.target.value)} 
            required 
          />
        </div>
        <h4>Parties:</h4>
        {parties.map((party, index) => (
          <div className="party-group" key={index}>
            <input 
              type="text" 
              value={party.name} 
              onChange={(e) => handlePartyChange(index, 'name', e.target.value)} 
              placeholder={`Party Name ${index + 1}`} 
              required 
            />
            <input 
              type="text" 
              value={party.candidate} 
              onChange={(e) => handlePartyChange(index, 'candidate', e.target.value)} 
              placeholder={`Candidate for ${party.name}`} 
              required 
            />
          </div>
        ))}
        <button type="button" className="add-party-button" onClick={handleAddParty}>Add Another Party</button>
        <button type="submit" className="submit-button">Create Election</button>
      </form>
    </div>
  );
};

export default CreateElection;
