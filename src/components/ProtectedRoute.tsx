import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';
import PageLoader from './PageLoader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
