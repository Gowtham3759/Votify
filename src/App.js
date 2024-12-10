import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import AdminDashboard from './Components/AdminDashboard';
import VotingPage from './Components/VotingPage';
import UserDashboard from './Components/UserDashboard';
import CreateElection from './Components/CreateElection';
import ManageElectionPage from './Components/ManageElectionPage';
import CreateUser from './Components/CreateUser';
import Result from './Components/Result';
import PrivateRoute from './Components/PrivateRoute';
import Register from './Components/Register'; // Import Register

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} /> {/* Use element, not component */}
          <Route path="/create-election" element={<CreateElection />} />

          {/* Admin routes protected by PrivateRoute */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-election/:electionId" element={<ManageElectionPage />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/view-results" element={<Result />} />
          </Route>

          {/* User routes protected by PrivateRoute */}
          <Route element={<PrivateRoute role="user" />}>
            <Route path="/vote/:electionId" element={<VotingPage />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
          </Route>

          {/* Default route - Redirect to login */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
