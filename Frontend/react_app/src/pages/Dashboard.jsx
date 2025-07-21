import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const username = localStorage.getItem('username') || 'Investor';

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome, {username} 📈</h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Watchlist Card */}
          <Link to="/watchlist" className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600">📊 Watchlist</h2>
            <p className="text-sm text-gray-600 mt-2">View and manage your favorite stocks.</p>
          </Link>

          {/* Portfolio Card */}
          <Link to="/portfolio" className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600">📉 Portfolio</h2>
            <p className="text-sm text-gray-600 mt-2">Track holdings, quantity, and value.</p>
          </Link>

          {/* Historical Data Card */}
          <Link to="/historical" className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600">📓 Historical Data</h2>
            <p className="text-sm text-gray-600 mt-2">Analyze past prices of tracked stocks.</p>
          </Link>
        </div>

        {/* News/Insights */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Market Insights</h3>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm italic">
              "Stay tuned for live financial news, upcoming earnings, and market sentiment updates in future releases."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
