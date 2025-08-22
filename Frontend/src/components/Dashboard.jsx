import React, { useEffect, useState } from 'react';
import MarketOverview from './dashboard/MarketOverview';
import PortfolioSummary from './dashboard/PortfolioSummary';
import TrendingStocks from './dashboard/TrendingStocks';
import QuickActions from './dashboard/QuickActions';
import { apiGet } from '../lib/api';
import { cacheGet, cacheSet } from '../lib/sessionCache';
import { useSidebar } from '../App';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  // Load cached username only; do not auto-fetch from API
  useEffect(() => {
    const cached = cacheGet('user:username');
    if (cached) {
      setUsername(cached);
    } else {
      (async () => {
        try {
          const me = await apiGet('/api/accounts/me/');
          const name = me?.first_name || me?.username || '';
          if (name) {
            setUsername(name);
            cacheSet('user:username', name);
          }
        } catch (_) {}
      })();
    }
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
    <div className="min-h-screen bg-neutral-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-finance text-white px-6 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">
                {`Welcome back${username ? `, ${username}` : ''}!`} 👋
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Here's what's happening with your investments today. Track performance, monitor markets, and make informed decisions.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              {/* Logo Icon */}
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        {/* Market Overview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Market Overview</h2>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
          <MarketOverview />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
          {/* Left Column - Portfolio Summary */}
          <div className="xl:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Portfolio Summary</h2>
              <p className="text-neutral-600">Your investment performance and holdings</p>
            </div>
            <PortfolioSummary />
          </div>
          
          {/* Right Column - Trending Stocks */}
          <div className="xl:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Trending Stocks</h2>
              <p className="text-neutral-600">Hot stocks in the market</p>
            </div>
            <TrendingStocks />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Quick Actions</h2>
            <p className="text-neutral-600">Common tasks and shortcuts</p>
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;