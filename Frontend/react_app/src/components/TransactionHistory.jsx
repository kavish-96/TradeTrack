import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../lib/api';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState('');
  const [quick, setQuick] = useState({ symbol: '', action: 'BUY', quantity: '', price: '' });

  const load = async () => {
    setError('');
    try {
      const data = await apiGet('/api/trades/');
      setTransactions(data);
    } catch (e) {
      setError('Failed to load transactions');
    }
  };

  useEffect(() => { load(); }, []);

  const addQuick = async () => {
    if (!(quick.symbol && quick.quantity && quick.price)) return;
    try {
      const payload = {
        symbol: quick.symbol.toUpperCase(),
        action: quick.action,
        quantity: parseInt(quick.quantity, 10),
        price: parseFloat(quick.price),
      };
      const created = await apiPost('/api/trades/', payload);
      setTransactions([created, ...transactions]);
      setQuick({ symbol: '', action: 'BUY', quantity: '', price: '' });
    } catch (e) {
      setError('Failed to create transaction');
    }
  };

  const filteredTransactions = transactions.filter((t) => filter === 'ALL' || t.action === filter);

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.created_at) - new Date(a.created_at);
        break;
      case 'symbol':
        comparison = a.symbol.localeCompare(b.symbol);
        break;
      case 'total':
        comparison = parseFloat(a.total) - parseFloat(b.total);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalBought = transactions.filter((t) => t.action === 'BUY').reduce((sum, t) => sum + parseFloat(t.total), 0);
  const totalSold = transactions.filter((t) => t.action === 'SELL').reduce((sum, t) => sum + parseFloat(t.total), 0);

  const formatDate = (iso) => {
    const dateTime = new Date(iso);
    return { date: dateTime.toLocaleDateString(), time: dateTime.toLocaleTimeString() };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your buy and sell transactions</p>
      </div>

      {/* Quick Add */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="input-field" placeholder="Symbol" value={quick.symbol} onChange={(e)=>setQuick({...quick, symbol:e.target.value})} />
          <select className="input-field" value={quick.action} onChange={(e)=>setQuick({...quick, action:e.target.value})}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input className="input-field" type="number" placeholder="Qty" value={quick.quantity} onChange={(e)=>setQuick({...quick, quantity:e.target.value})} />
          <input className="input-field" type="number" step="0.01" placeholder="Price" value={quick.price} onChange={(e)=>setQuick({...quick, price:e.target.value})} />
          <button className="btn-primary" onClick={addQuick}>Add</button>
        </div>
        {error && <div className="text-error-600 text-sm mt-2">{error}</div>}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Total Bought</h3><div className="text-2xl font-bold text-success-600">${totalBought.toLocaleString()}</div></div>
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Total Sold</h3><div className="text-2xl font-bold text-error-600">${totalSold.toLocaleString()}</div></div>
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Net Flow</h3><div className={`text-2xl font-bold ${(totalBought - totalSold) >= 0 ? 'text-success-600' : 'text-error-600'}`}>${(totalBought - totalSold).toLocaleString()}</div></div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
                <option value="ALL">All Transactions</option>
                <option value="BUY">Buy Orders</option>
                <option value="SELL">Sell Orders</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto">
                <option value="date">Date</option>
                <option value="symbol">Symbol</option>
                <option value="total">Amount</option>
              </select>
            </div>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="btn-secondary">{sortOrder === 'asc' ? '↑' : '↓'}</button>
          </div>
          <div className="text-sm text-gray-600">{filteredTransactions.length} transactions</div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {sortedTransactions.map((t) => {
          const { date, time } = formatDate(t.created_at);
          return (
            <div key={t.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${t.action === 'BUY' ? 'bg-success-500' : 'bg-error-500'}`}></div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${t.action === 'BUY' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'}`}>{t.action}</span>
                      <span className="text-lg font-bold text-gray-900">{t.symbol}</span>
                    </div>
                    <div className="text-sm text-gray-600">{t.quantity} shares @ ${parseFloat(t.price).toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${t.action === 'BUY' ? 'text-error-600' : 'text-success-600'}`}>{t.action === 'BUY' ? '-' : '+'}${parseFloat(t.total).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{date} at {time}</div>
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