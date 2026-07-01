import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (user) {
    if (profile?.role === 'tutor') {
      return <Navigate to="/tutor/onboarding" replace />;
    }
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
}
