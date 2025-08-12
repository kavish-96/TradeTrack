import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import TransactionHistory from './components/TransactionHistory';
import Charts from './components/Charts';
import News from './components/News';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'signup':
          return <Signup onSwitchToLogin={() => setCurrentPage('login')} />;
        default:
          return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />;
      }
    }

    switch (currentPage) {
      case 'watchlist':
        return <Watchlist />;
      case 'portfolio':
        return <Portfolio />;
      case 'transactions':
        return <TransactionHistory />;
      case 'charts':
        return <Charts />;
      case 'news':
        return <News />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;