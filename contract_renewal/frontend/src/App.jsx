import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Contracts from './components/Contracts';
import Login from './components/Login';
// import Upload from './components/Upload';
import Settings from './components/Settings';

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contracts, setContracts] = useState([]);

  const fetchContracts = async () => {
    if (user) {
      const res = await fetch('http://localhost:8000/contracts/');
      const data = await res.json();
      setContracts(data);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [user]);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard contracts={contracts} />;
      case 'contracts':
        return <Contracts contracts={contracts} onDataChange={fetchContracts} />;
      // case 'upload':
      //   return <Upload />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard contracts={contracts} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} contracts={contracts}>
      {renderContent()}
    </Layout>
  );
};

export default App;