// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <nav className="bg-white text-blue-700 px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">TradeTrack</Link>
        <div className="flex gap-6">
          {token ? (
            <>
              <Link to="/watchlist" className="hover:text-blue-500 font-medium">Watchlist</Link>
              <Link to="/portfolio" className="hover:text-blue-500 font-medium">Portfolio</Link>
              <Link to="/historical" className="hover:text-blue-500 font-medium">Historical</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-500 font-medium">Login</Link>
              <Link to="/signup" className="hover:text-blue-500 font-medium">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
