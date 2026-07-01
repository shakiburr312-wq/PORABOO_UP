import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';
import PageLoader from './PageLoader';

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (user) {
    if (profile?.role === 'tutor') {
      return <Navigate to="/tutor/onboarding" replace />;
    }
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
}
