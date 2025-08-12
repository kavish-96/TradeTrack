import React from 'react';

const TrendingStocks = () => {
  const trendingStocks = [
    { symbol: 'TSLA', name: 'Tesla Inc', price: '$245.67', change: '+5.23%', trend: '📈' },
    { symbol: 'AAPL', name: 'Apple Inc', price: '$189.25', change: '+2.14%', trend: '📈' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: '$452.10', change: '+8.95%', trend: '📈' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: '$128.44', change: '-1.23%', trend: '📉' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: '$125.89', change: '+0.87%', trend: '📈' },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Stocks</h3>
      <div className="space-y-3">
        {trendingStocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition duration-200">
            <div className="flex items-center">
              <span className="text-xl mr-3">{stock.trend}</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{stock.symbol}</div>
                <div className="text-xs text-gray-600">{stock.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 text-sm">{stock.price}</div>
              <div className={`text-xs font-medium ${
                stock.change.startsWith('+') ? 'text-success-600' : 'text-error-600'
              }`}>
                {stock.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingStocks;