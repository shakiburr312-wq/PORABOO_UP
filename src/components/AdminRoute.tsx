import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';
import PageLoader from './PageLoader';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
}
