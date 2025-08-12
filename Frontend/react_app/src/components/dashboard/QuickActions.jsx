import React from 'react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Watchlist',
      description: 'Track your favorite stocks',
      icon: '👁️',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Portfolio',
      description: 'View your holdings',
      icon: '💼',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600'
    },
    {
      title: 'News',
      description: 'Latest market updates',
      icon: '📰',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Charts',
      description: 'Analyze stock trends',
      icon: '📈',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <div key={action.title} className="card p-6 text-center hover:shadow-md transition duration-200 cursor-pointer">
            <div className={`w-12 h-12 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <span className="text-2xl">{action.icon}</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
            <p className="text-sm text-gray-600">{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;