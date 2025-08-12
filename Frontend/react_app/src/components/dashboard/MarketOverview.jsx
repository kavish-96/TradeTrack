import React from 'react';

const MarketOverview = () => {
  const indices = [
    {
      name: 'Nifty 50',
      value: '19,745.20',
      change: '+145.30',
      changePercent: '+0.74%',
      isPositive: true
    },
    {
      name: 'NASDAQ',
      value: '15,235.71',
      change: '-42.18',
      changePercent: '-0.28%',
      isPositive: false
    },
    {
      name: 'S&P 500',
      value: '4,547.38',
      change: '+12.45',
      changePercent: '+0.27%',
      isPositive: true
    }
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {indices.map((index) => (
          <div key={index.name} className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{index.name}</h3>
            <div className="text-2xl font-bold text-gray-900 mb-1">{index.value}</div>
            <div className={`text-sm font-medium ${
              index.isPositive ? 'text-success-600' : 'text-error-600'
            }`}>
              <span className="mr-1">{index.isPositive ? '↗' : '↘'}</span>
              {index.change} ({index.changePercent})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;