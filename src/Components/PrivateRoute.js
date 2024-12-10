import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role }) => {
  const isAuthenticated = localStorage.getItem('user'); // Check for authentication
  const user = isAuthenticated ? JSON.parse(isAuthenticated) : null;

  return (
    <>
      {isAuthenticated && user.role === role ? (
        <Outlet /> // Render the child routes
      ) : (
        <Navigate to="/login" /> // Redirect to login if not authenticated
      )}
    </>
  );
};

export default PrivateRoute;
