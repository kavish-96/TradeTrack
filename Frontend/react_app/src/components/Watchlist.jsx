import React, { useState } from 'react';

const Watchlist = () => {
  const [stocks, setStocks] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 189.25,
      change: 4.23,
      changePercent: 2.29,
      trend: [180, 185, 182, 188, 189, 192, 189]
    },
    {
      id: 2,
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      price: 125.89,
      change: -2.14,
      changePercent: -1.67,
      trend: [130, 128, 132, 125, 127, 124, 126]
    },
    {
      id: 3,
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 245.67,
      change: 12.45,
      changePercent: 5.34,
      trend: [230, 235, 240, 248, 245, 250, 246]
    }
  ]);
  const [newStock, setNewStock] = useState('');
  const [sortBy, setSortBy] = useState('symbol');

  const removeStock = (id) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const addStock = () => {
    if (newStock.trim()) {
      const newStockData = {
        id: Date.now(),
        symbol: newStock.toUpperCase(),
        name: `${newStock} Inc`,
        price: Math.random() * 200 + 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        trend: Array.from({ length: 7 }, () => Math.random() * 50 + 100)
      };
      setStocks([...stocks, newStockData]);
      setNewStock('');
    }
  };

  const renderTrendLine = (trend) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8 w-16">
        {trend.map((value, index) => (
          <div
            key={index}
            className="bg-primary-400 w-1 rounded-sm"
            style={{
              height: `${((value - min) / range) * 100}%`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Watchlist</h1>
        <p className="text-gray-600">Track your favorite stocks and monitor their performance</p>
      </div>

      {/* Add Stock Section */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Stock to Watchlist</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="input-field flex-1"
          />
          <button
            onClick={addStock}
            className="btn-primary"
          >
            Add Stock
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto"
          >
            <option value="symbol">Symbol</option>
            <option value="price">Price</option>
            <option value="change">Change</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {stocks.length} stocks in watchlist
        </div>
      </div>

      {/* Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <div key={stock.id} className="card p-6 hover:shadow-md transition duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
                <p className="text-sm text-gray-600">{stock.name}</p>
              </div>
              <button
                onClick={() => removeStock(stock.id)}
                className="text-gray-400 hover:text-error-600 transition duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stock.price.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${
                  stock.change >= 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} 
                  ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>
              <div>
                {renderTrendLine(stock.trend)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="btn-secondary flex-1 py-2 text-sm">
                View Details
              </button>
              <button className="btn-primary flex-1 py-2 text-sm">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {stocks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👁️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks in watchlist</h3>
          <p className="text-gray-600">Add some stocks to start tracking their performance</p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;