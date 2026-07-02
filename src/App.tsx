import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import LegalModal from './components/LegalModal';
import React, { useState } from 'react';

// Pages
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TutorOnboarding from "./pages/TutorOnboarding";
import GuardianDashboard from "./pages/GuardianDashboard";
import JobPostCreate from "./pages/JobPostCreate";
import JobBoard from "./pages/JobBoard";
import Feed from "./pages/Feed";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminRoute } from "./components/AdminRoute";

import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import RevenueSection from "./components/RevenueSection";

import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [activeLegal, setActiveLegal] = useState<"privacy" | "terms" | "refund" | null>(null);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-navy-bg text-navy flex flex-col justify-between selection:bg-yellow/30 selection:text-navy">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection
          onJoinAsTutor={() => navigate('/register?role=tutor')} 
          onSearchTutor={() => navigate('/register?role=guardian')}
        />
        <StatsSection />
        <HowItWorksSection />
        <RevenueSection />
      </main>
      <Footer onShowModal={(type) => setActiveLegal(type)} />
      <LegalModal
        type={activeLegal}
        onClose={() => setActiveLegal(null)}
      />
    </div>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeLegal, setActiveLegal] = useState<"privacy" | "terms" | "refund" | null>(null);
  
  return (
    <div className="relative min-h-screen bg-[#F0F2F5] text-navy flex flex-col justify-between selection:bg-yellow/30 selection:text-navy">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer onShowModal={(type) => setActiveLegal(type)} />
      <LegalModal
        type={activeLegal}
        onClose={() => setActiveLegal(null)}
      />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LanguageSwitcher />
        <BrowserRouter>
          <Routes>
            {/* Public only — redirect if logged in */}
            <Route path="/" element={
              <PublicOnlyRoute>
                <LandingPage />
              </PublicOnlyRoute>
            } />
            <Route path="/login" element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            } />
            <Route path="/reset-password" element={
              <PublicOnlyRoute>
                <ResetPassword />
              </PublicOnlyRoute>
            } />
            <Route path="/admin/login" element={
              <AdminLogin />
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            {/* Auth callback — always accessible */}
            <Route path="/auth/callback" 
              element={<AuthCallback />} 
            />

            {/* Protected — redirect to login if not logged in */}
            <Route path="/feed" element={
              <ProtectedRoute>
                <MainLayout><Feed /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout><ProfilePage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <MainLayout><ProfilePage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/job-board" element={
              <ProtectedRoute>
                <MainLayout><JobBoard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/tutor/onboarding" element={
              <ProtectedRoute>
                <MainLayout><TutorOnboarding /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout><SettingsPage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/guardian/dashboard" element={
              <ProtectedRoute>
                <MainLayout><GuardianDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/guardian/post/new" element={
              <ProtectedRoute>
                <MainLayout><JobPostCreate /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
