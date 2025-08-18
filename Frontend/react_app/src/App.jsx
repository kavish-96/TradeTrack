import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import TransactionHistory from './components/TransactionHistory';
import Charts from './components/Charts';
import News from './components/News';
import { getAccessToken, clearTokens } from './lib/api';

function App() {
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('currentPage') || 'login');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());

  useEffect(() => {
    // Persist current page
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // If user came from a protected page saved in localStorage, keep it; otherwise go to dashboard
    const saved = localStorage.getItem('currentPage');
    if (!saved || saved === 'login' || saved === 'signup' || saved === 'forgot') {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'signup':
          return <Signup onSwitchToLogin={() => setCurrentPage('login')} />;
        case 'forgot':
          return <ForgotPassword onBackToLogin={() => setCurrentPage('login')} />;
        default:
          return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} onForgotPassword={() => setCurrentPage('forgot')} />;
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