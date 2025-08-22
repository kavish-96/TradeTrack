import React, { useEffect, useState, createContext, useContext } from 'react';
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

// Create context for sidebar state
const SidebarContext = createContext();

// Custom hook to use sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

function App() {
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('currentPage') || 'login');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Sidebar context value
  const sidebarContextValue = {
    sidebarOpen,
    setSidebarOpen
  };

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <div className="min-h-screen bg-neutral-50">
        {isAuthenticated && (
          <Navigation 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
          />
        )}
        {renderPage()}
      </div>
    </SidebarContext.Provider>
  );
}

export default App;