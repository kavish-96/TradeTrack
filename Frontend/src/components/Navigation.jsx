import React, { useEffect } from 'react';
import { useSidebar } from '../App';

const Navigation = ({ currentPage, setCurrentPage, onLogout }) => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  // Auto-minimize sidebar when page changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPage, setSidebarOpen]);

  const navItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      description: 'Overview & Analytics'
    },
    { 
      key: 'watchlist', 
      label: 'Watchlist', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: 'Track Favorite Stocks'
    },
    { 
      key: 'portfolio', 
      label: 'Portfolio', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Your Investments'
    },
    { 
      key: 'transactions', 
      label: 'Transactions', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: 'Trade History'
    },
    { 
      key: 'charts', 
      label: 'Charts', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      description: 'Advanced Analytics'
    },
    { 
      key: 'news', 
      label: 'News', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      description: 'Market Updates'
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:w-80' : 'lg:w-20'
      }`}>
        {/* Logo Section */}
        <div className={`flex items-center py-6 border-b border-neutral-200 ${sidebarOpen ? 'px-6' : 'px-2'}`}>
          <div className="w-10 h-10 bg-gradient-finance rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0 mr-3">
              <h1 className="text-xl font-bold text-neutral-900">TradeTrack</h1>
              <p className="text-xs text-neutral-500">Stock tracking and portfolio management</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`w-full group flex items-center space-x-3 py-3 rounded-xl transition-all duration-200 text-left ${
                currentPage === item.key
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600 shadow-soft'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              } ${sidebarOpen ? 'px-4' : 'px-2 justify-center'}`}
            >
              <div className={`flex-shrink-0 ${
                currentPage === item.key ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'
              }`}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    currentPage === item.key ? 'text-primary-500' : 'text-neutral-400 group-hover:text-neutral-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className={`border-t border-neutral-200 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
          <div className={`flex items-center space-x-3 p-3 rounded-xl bg-neutral-50 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-finance rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900">Trading Account</div>
                <div className="text-xs text-neutral-500">Active Session</div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-finance rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-neutral-900">TradeTrack</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-finance rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="mt-3">
            <div className="flex space-x-1 overflow-x-auto pb-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentPage(item.key)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.key
                      ? 'bg-primary-100 text-primary-700 shadow-soft'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Offset for Desktop Sidebar */}
      <div className={`lg:pl-${sidebarOpen ? '80' : '20'}`}></div>
    </>
  );
};

export default Navigation;