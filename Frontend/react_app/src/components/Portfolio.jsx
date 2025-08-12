import React, { useState } from 'react';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc',
      quantity: 50,
      purchasePrice: 175.20,
      currentPrice: 189.25,
      totalInvested: 8760,
      currentValue: 9462.50,
      pl: 702.50,
      plPercent: 8.02
    },
    {
      id: 2,
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      quantity: 25,
      purchasePrice: 132.45,
      currentPrice: 125.89,
      totalInvested: 3311.25,
      currentValue: 3147.25,
      pl: -164,
      plPercent: -4.95
    },
    {
      id: 3,
      symbol: 'TSLA',
      name: 'Tesla Inc',
      quantity: 30,
      purchasePrice: 220.15,
      currentPrice: 245.67,
      totalInvested: 6604.50,
      currentValue: 7370.10,
      pl: 765.60,
      plPercent: 11.59
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: ''
  });

  const totalInvested = portfolio.reduce((sum, stock) => sum + stock.totalInvested, 0);
  const totalCurrentValue = portfolio.reduce((sum, stock) => sum + stock.currentValue, 0);
  const totalPL = totalCurrentValue - totalInvested;
  const totalPLPercent = (totalPL / totalInvested) * 100;

  const handleAddPosition = () => {
    if (newPosition.symbol && newPosition.quantity && newPosition.purchasePrice) {
      const quantity = parseInt(newPosition.quantity);
      const purchasePrice = parseFloat(newPosition.purchasePrice);
      const currentPrice = purchasePrice * (1 + (Math.random() - 0.5) * 0.2); // Mock current price
      
      const newStock = {
        id: Date.now(),
        symbol: newPosition.symbol.toUpperCase(),
        name: `${newPosition.symbol} Inc`,
        quantity: quantity,
        purchasePrice: purchasePrice,
        currentPrice: currentPrice,
        totalInvested: quantity * purchasePrice,
        currentValue: quantity * currentPrice,
        pl: quantity * (currentPrice - purchasePrice),
        plPercent: ((currentPrice - purchasePrice) / purchasePrice) * 100
      };
      
      setPortfolio([...portfolio, newStock]);
      setNewPosition({ symbol: '', quantity: '', purchasePrice: '' });
      setShowAddModal(false);
    }
  };

  const removePosition = (id) => {
    setPortfolio(portfolio.filter(stock => stock.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
        <p className="text-gray-600">Manage your stock investments and track performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Invested</h3>
          <div className="text-2xl font-bold text-gray-900">${totalInvested.toFixed(2)}</div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Current Value</h3>
          <div className="text-2xl font-bold text-gray-900">${totalCurrentValue.toFixed(2)}</div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total P&L</h3>
          <div className={`text-2xl font-bold ${totalPL >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Overall Return</h3>
          <div className={`text-2xl font-bold ${totalPLPercent >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add Position
        </button>
        <div className="flex space-x-2">
          <button className="btn-secondary">Export CSV</button>
          <button className="btn-secondary">Export PDF</button>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P&L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stock.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${stock.purchasePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${stock.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${stock.totalInvested.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${stock.currentValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      stock.pl >= 0 ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {stock.pl >= 0 ? '+' : ''}${stock.pl.toFixed(2)}
                    </div>
                    <div className={`text-xs ${
                      stock.plPercent >= 0 ? 'text-success-600' : 'text-error-600'
                    }`}>
                      ({stock.plPercent >= 0 ? '+' : ''}{stock.plPercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => removePosition(stock.id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Position</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    value={newPosition.symbol}
                    onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})}
                    className="input-field"
                    placeholder="e.g., AAPL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newPosition.quantity}
                    onChange={(e) => setNewPosition({...newPosition, quantity: e.target.value})}
                    className="input-field"
                    placeholder="Number of shares"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPosition.purchasePrice}
                    onChange={(e) => setNewPosition({...newPosition, purchasePrice: e.target.value})}
                    className="input-field"
                    placeholder="Price per share"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPosition}
                  className="btn-primary"
                >
                  Add Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;