import React from 'react';

const Navigation = ({ currentPage, setCurrentPage, onLogout }) => {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'watchlist', label: 'Watchlist', icon: '👁️' },
    { key: 'portfolio', label: 'Portfolio', icon: '💼' },
    { key: 'transactions', label: 'Transactions', icon: '📋' },
    { key: 'charts', label: 'Charts', icon: '📈' },
    { key: 'news', label: 'News', icon: '📰' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">TradeTrack</h1>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentPage(item.key)}
                  className={`${
                    currentPage === item.key
                      ? 'text-primary-600 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  } border-b-2 px-3 py-4 text-sm font-medium transition duration-200`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>Market Open</span>
            </div> */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600">👤</div>
              <button onClick={onLogout} className="text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition duration-200">
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden pb-3 pt-2 space-y-1">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`${
                  currentPage === item.key
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-800'
                } px-3 py-2 rounded-lg text-sm font-medium transition duration-200`}
              >
                <div className="text-lg">{item.icon}</div>
                <div className="text-xs mt-1">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;