import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/authService';

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;