import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './VotingPage.css';

const VotingPage = () => {
  const [election, setElection] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [userVotes, setUserVotes] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // Get the logged-in user from local storage
  const navigate = useNavigate();
  const { electionId } = useParams(); // Extract electionId from the URL

  useEffect(() => {
    const fetchElection = async () => {
      try {
        // Fetch the specific election using the electionId from the URL
        const response = await axios.get(`http://localhost:8080/elections/${electionId}`);
        setElection(response.data);
      } catch (error) {
        console.error('Error fetching election:', error);
      }
    };

    const fetchUserVotes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/votes');
        const votesByUser = response.data.filter(vote => vote.userId === user.id);
        setUserVotes(votesByUser);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchElection();
    fetchUserVotes();
  }, [electionId, user.id]);

  const hasVoted = () => {
    return userVotes.some(vote => vote.electionId === electionId); // Check if the user has voted in this election
  };

  const handleVote = async (partyName, candidateName) => {
    if (hasVoted()) {
      alert('You have already voted in this election. Thank you!');
      return;
    }

    try {
      // Update the party's vote count in the election
      const updatedParties = election.parties.map((party) => {
        if (party.name === partyName) {
          return { ...party, voteCount: (party.voteCount || 0) + 1 };
        }
        return party;
      });

      // Update the election with the new vote count
      await axios.patch(`http://localhost:8080/elections/${electionId}`, {
        parties: updatedParties,
      });

      // Record the vote in the /votes endpoint
      await axios.post('http://localhost:8080/votes', {
        userId: user.id,
        electionId: electionId,
        party: partyName,
        candidate: candidateName,
      });

      alert('Vote submitted successfully!');
      setVoteSubmitted(true);
      navigate('/userdashboard');
    } catch (error) {
      console.error('Error submitting vote:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'An error occurred while submitting your vote. Please try again.'}`);
      } else {
        alert('An error occurred. Please check your network connection.');
      }
    }
  };

  return (
    <div className="voting-page-body09">
      <div className="voting-page-container09">
        <h2 className="voting-page-title09">Voting Page</h2>
        {election ? (
          <div>
            <h3>{election.name}</h3>
            <p>Date: {election.date}</p>
            <h4>Parties:</h4>
            {hasVoted() ? (
              <p>Already voted, thank you!</p>
            ) : (
              <ul className="party-list09">
                {election.parties.map((party) => (
                  <li key={party.name} className="party-option09">
                    <strong>{party.name}</strong> - Candidate: {party.candidate}
                    <button onClick={() => handleVote(party.name, party.candidate)} className="vote-button09">
                      Vote
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>Loading election...</p>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
