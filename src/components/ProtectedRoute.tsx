import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate } from 'react-router-dom';
import PageLoader from './PageLoader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-4">
          <span className="logo-font text-3xl text-[#1B2F6E]">PORABOO</span>
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#F5A623] rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
