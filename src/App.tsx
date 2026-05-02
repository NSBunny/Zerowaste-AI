/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { DonorDashboard } from './pages/DonorDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  // If a role is required but doesn't match, we only redirect if the user is authenticated 
  // but trying to access the WRONG dashboard for their CURRENT session role.
  if (requiredRole && profile?.role !== requiredRole) {
    // If the profile role is missing or just different, we wait a moment or redirect to their active role
    // This part was too aggressive. For a better demo, let's just deny access or redirect to home.
    return <Navigate to="/" />; 
  }

  return <>{children}</>;
}

function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/donor" element={
            <ProtectedRoute requiredRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/ngo" element={
            <ProtectedRoute requiredRole="ngo">
              <NGODashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/volunteer" element={
            <ProtectedRoute requiredRole="volunteer">
              <VolunteerDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}
