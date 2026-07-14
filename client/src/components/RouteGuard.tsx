import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isVerifying } = useAuth();
  const location = useLocation();

  if (isVerifying) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-main)',
          gap: '16px',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid hsl(var(--primary))',
            borderTopColor: 'transparent',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
          Loading your workspace...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember original destination
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
