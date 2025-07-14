import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { createUserProfile, getUserProfile } from './services/firebaseService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Settings from './components/settings/Settings';
import Login from './components/auth/Login';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [selectedStock, setSelectedStock] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        setCurrentView('home');
        
        try {
          // Try to get existing user profile
          let profile = await getUserProfile(user.uid);
          
          if (!profile) {
            // Create new user profile if it doesn't exist
            profile = await createUserProfile(user);
          } else {
            // Update last login time
            await createUserProfile(user); // This will update the profile
          }
          
          setUserProfile(profile);
        } catch (error) {
          console.error('Error handling user profile:', error);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserProfile(null);
        setCurrentView('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    // This will be handled by the auth state listener
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSelectedStock('');
      setShowSettings(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (stockSymbol) => {
    setSelectedStock(stockSymbol);
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedStock('');
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' ? (
        <Home onSearch={handleSearch} />
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <Header 
            onBackToHome={handleBackToHome} 
            onSettingsClick={handleSettingsClick}
            onLogout={handleLogout}
            user={user}
            userProfile={userProfile}
          />
          <Dashboard 
            selectedStock={selectedStock} 
            showSettings={showSettings}
            onCloseSettings={handleCloseSettings}
            user={user}
            userProfile={userProfile}
          />
        </div>
      )}
    </div>
  );
}

export default App; 