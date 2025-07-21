import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import HistoricalData from './pages/HistoricalData';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';


const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/watchlist"
            element={<PrivateRoute><Watchlist /></PrivateRoute>}
          />
          <Route
            path="/portfolio"
            element={<PrivateRoute><Portfolio /></PrivateRoute>}
          />
          <Route
            path="/historical"
            element={<PrivateRoute><HistoricalData /></PrivateRoute>}
          />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
