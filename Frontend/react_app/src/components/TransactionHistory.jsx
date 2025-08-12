import React, { useState } from 'react';

const TransactionHistory = () => {
  const [transactions] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      action: 'BUY',
      quantity: 50,
      price: 175.20,
      total: 8760,
      date: '2023-12-15',
      time: '09:30:00'
    },
    {
      id: 2,
      symbol: 'GOOGL',
      action: 'BUY',
      quantity: 25,
      price: 132.45,
      total: 3311.25,
      date: '2023-12-14',
      time: '10:15:22'
    },
    {
      id: 3,
      symbol: 'TSLA',
      action: 'SELL',
      quantity: 10,
      price: 245.67,
      total: 2456.70,
      date: '2023-12-13',
      time: '14:25:45'
    },
    {
      id: 4,
      symbol: 'TSLA',
      action: 'BUY',
      quantity: 40,
      price: 220.15,
      total: 8806,
      date: '2023-12-12',
      time: '11:42:10'
    },
    {
      id: 5,
      symbol: 'MSFT',
      action: 'BUY',
      quantity: 30,
      price: 378.45,
      total: 11353.50,
      date: '2023-12-11',
      time: '13:20:33'
    }
  ]);

  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'ALL') return true;
    return transaction.action === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
        break;
      case 'symbol':
        comparison = a.symbol.localeCompare(b.symbol);
        break;
      case 'total':
        comparison = a.total - b.total;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDate = (date, time) => {
    const dateTime = new Date(date + ' ' + time);
    return {
      date: dateTime.toLocaleDateString(),
      time: dateTime.toLocaleTimeString()
    };
  };

  const totalBought = transactions
    .filter(t => t.action === 'BUY')
    .reduce((sum, t) => sum + t.total, 0);
    
  const totalSold = transactions
    .filter(t => t.action === 'SELL')
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your buy and sell transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Bought</h3>
          <div className="text-2xl font-bold text-success-600">${totalBought.toLocaleString()}</div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sold</h3>
          <div className="text-2xl font-bold text-error-600">${totalSold.toLocaleString()}</div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Net Flow</h3>
          <div className={`text-2xl font-bold ${totalBought - totalSold >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            ${(totalBought - totalSold).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field w-auto"
              >
                <option value="ALL">All Transactions</option>
                <option value="BUY">Buy Orders</option>
                <option value="SELL">Sell Orders</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto"
              >
                <option value="date">Date</option>
                <option value="symbol">Symbol</option>
                <option value="total">Amount</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredTransactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transactions Timeline */}
      <div className="space-y-4">
        {sortedTransactions.map((transaction, index) => {
          const { date, time } = formatDate(transaction.date, transaction.time);
          
          return (
            <div key={transaction.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.action === 'BUY' ? 'bg-success-500' : 'bg-error-500'
                  }`}></div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.action === 'BUY' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {transaction.action}
                      </span>
                      <span className="text-lg font-bold text-gray-900">{transaction.symbol}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.quantity} shares @ ${transaction.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    transaction.action === 'BUY' ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {transaction.action === 'BUY' ? '-' : '+'}${transaction.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {date} at {time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">No transactions match your current filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;