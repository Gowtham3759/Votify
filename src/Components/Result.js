// src/Components/Result.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './Result.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Result = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/elections');
        setElections(response.data);
      } catch (error) {
        console.error('Failed to fetch election results:', error);
      }
    };

    fetchElections();
  }, []);

  const generateColors = (count) => {
    // Generate an array of distinct colors
    const colors = [
      '#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#34495e', '#f39c12', '#d35400',
    ];
    return Array(count).fill().map((_, i) => colors[i % colors.length]);
  };

  const renderChart = (election) => {
    const data = {
      labels: election.parties.map((party) => party.name),
      datasets: [
        {
          label: 'Votes',
          data: election.parties.map((party) => party.voteCount || 0),
          backgroundColor: generateColors(election.parties.length),
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#2c3e50' },
        },
        x: {
          ticks: { color: '#2c3e50' },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return (
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    );
  };

  return (
    <div className="result-container">
      <h2 className="result-title">Election Results</h2>
      {elections.length === 0 ? (
        <p className="no-results">No election results available.</p>
      ) : (
        <div className="chart-wrapper">
          {elections.map((election) => (
            <div key={election.id} className="election-section">
              <h3 className="election-name">{election.name}</h3>
              <p className="election-date">Date: {election.date}</p>
              {renderChart(election)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Result;
