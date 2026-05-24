import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/tokenStorage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(getRole())) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
