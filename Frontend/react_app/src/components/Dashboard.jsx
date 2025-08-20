import React, { useEffect, useState } from 'react';
import MarketOverview from './dashboard/MarketOverview';
import PortfolioSummary from './dashboard/PortfolioSummary';
import TrendingStocks from './dashboard/TrendingStocks';
import QuickActions from './dashboard/QuickActions';
import { apiGet } from '../lib/api';
import { cacheGet, cacheSet } from '../lib/sessionCache';

const Dashboard = () => {
  const [username, setUsername] = useState('');

  // Load cached username only; do not auto-fetch from API
  useEffect(() => {
    const cached = cacheGet('user:username');
    if (cached) setUsername(cached);
  }, []);

  const fetchUsername = async () => {
    try {
      const me = await apiGet('/api/accounts/me/');
      const name = me?.first_name || me?.username || '';
      if (name) {
        setUsername(name);
        cacheSet('user:username', name);
      }
    } catch (_) {}
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {`Welcome back${username ? `, ${username}` : ''}!`} 👋
          </h1>
          {!username && (
            <button className="btn-secondary text-sm" onClick={fetchUsername}>Load Name</button>
          )}
        </div>
        <p className="text-gray-600">
          Here's what's happening with your investments today.
        </p>
      </div>

      {/* Market Overview */}
      <MarketOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Portfolio Summary */}
        <div className="lg:col-span-2">
          <PortfolioSummary />
        </div>
        
        {/* Right Column - Trending Stocks */}
        <div>
          <TrendingStocks />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;