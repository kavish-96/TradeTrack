import React from 'react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Watchlist',
      description: 'Track your favorite stocks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      page: 'watchlist',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Portfolio',
      description: 'View your holdings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      page: 'portfolio',
      gradient: 'from-success-500 to-success-600'
    },
    {
      title: 'Transactions',
      description: 'View trade history',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: 'bg-neutral-50',
      iconColor: 'text-neutral-600',
      page: 'transactions',
      gradient: 'from-neutral-500 to-neutral-600'
    },
    {
      title: 'News',
      description: 'Latest market updates',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
      page: 'news',
      gradient: 'from-warning-500 to-warning-600'
    },
    {
      title: 'Charts',
      description: 'Analyze stock trends',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      bgColor: 'bg-accent-50',
      iconColor: 'text-accent-600',
      page: 'charts',
      gradient: 'from-accent-500 to-accent-600'
    }
  ];

  const navigateToPage = (page) => {
    // Store the target page in localStorage
    localStorage.setItem('currentPage', page);
    // Reload the page to trigger navigation
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {actions.map((action) => (
        <div 
          key={action.title} 
          className="card-hover p-6 text-center cursor-pointer group"
          onClick={() => navigateToPage(action.page)}
        >
          {/* Icon Container */}
          <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
            <div className={action.iconColor}>
              {action.icon}
            </div>
          </div>

          {/* Content */}
          <h4 className="font-semibold text-neutral-900 mb-2 text-lg">{action.title}</h4>
          <p className="text-sm text-neutral-600 mb-4">{action.description}</p>

          {/* Action Button */}
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r ${action.gradient} text-white text-sm font-medium group-hover:shadow-lg transition-all duration-200`}>
            <span>Open</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;