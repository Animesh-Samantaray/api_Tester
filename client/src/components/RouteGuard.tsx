import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Loading indicator helper in case system starts
  // Since authentication is immediate in localStorage, we can check immediately
  if (!isAuthenticated) {
    // Redirect to login page and remember original destination
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
