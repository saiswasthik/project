import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Reservations from './pages/Reservations';
import NewReservation from './pages/NewReservation';
import Tables from './pages/Tables';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a high-end full-screen loader

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Reservations />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/new-reservation" element={<NewReservation />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <DataProvider>
              <AppContent />
            </DataProvider>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
