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
  const netFlow = totalBought - totalSold;

  const formatDate = (iso) => {
    const dateTime = new Date(iso);
    return { date: dateTime.toLocaleDateString(), time: dateTime.toLocaleTimeString() };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-finance mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Transaction History</h1>
                  <p className="text-white/90 text-lg">Track your buy and sell transactions with detailed insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">${totalBought.toLocaleString()} bought</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">${totalSold.toLocaleString()} sold</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">{filteredTransactions.length} transactions</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Section */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">Quick Add Transaction</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <input 
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
              placeholder="Symbol (e.g., AAPL)" 
              value={quick.symbol} 
              onChange={(e)=>setQuick({...quick, symbol:e.target.value})} 
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <select 
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
            value={quick.action} 
            onChange={(e)=>setQuick({...quick, action:e.target.value})}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
          <input 
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
            type="number" 
            placeholder="Quantity" 
            value={quick.quantity} 
            onChange={(e)=>setQuick({...quick, quantity:e.target.value})} 
          />
          <input 
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
            type="number" 
            step="0.01" 
            placeholder="Price per share" 
            value={quick.price} 
            onChange={(e)=>setQuick({...quick, price:e.target.value})} 
          />
          <button 
            className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2" 
            onClick={addQuick}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add</span>
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Combined Summary Card */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <h3 className="text-sm font-medium text-neutral-600">Total Bought</h3>
            </div>
            <div className="text-3xl font-bold text-success-600">${totalBought.toLocaleString()}</div>
            <p className="text-xs text-neutral-500 mt-1">All buy transactions</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              <h3 className="text-sm font-medium text-neutral-600">Total Sold</h3>
            </div>
            <div className="text-3xl font-bold text-error-600">${totalSold.toLocaleString()}</div>
            <p className="text-xs text-neutral-500 mt-1">All sell transactions</p>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end space-x-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${netFlow >= 0 ? 'bg-success-500' : 'bg-error-500'}`}></div>
              <h3 className="text-sm font-medium text-neutral-600">Net Flow</h3>
            </div>
            <div className={`text-3xl font-bold ${netFlow >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              ${netFlow.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {netFlow >= 0 ? 'Net investment' : 'Net withdrawal'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-neutral-700">Filter:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-w-[140px]"
              >
                <option value="ALL">All Transactions</option>
                <option value="BUY">Buy Orders</option>
                <option value="SELL">Sell Orders</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-neutral-700">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-w-[120px]"
              >
                <option value="date">Date</option>
                <option value="symbol">Symbol</option>
                <option value="total">Amount</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
                className="px-3 py-2 border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-600 bg-neutral-100 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {sortedTransactions.map((t) => {
                const { date, time } = formatDate(t.created_at);
                return (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${t.action === 'BUY' ? 'bg-success-500' : 'bg-error-500'}`}></div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          t.action === 'BUY' 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {t.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-neutral-900">{t.symbol}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-700">{t.quantity} shares</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-700">${parseFloat(t.price).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-lg font-bold ${
                        t.action === 'BUY' ? 'text-error-600' : 'text-success-600'
                      }`}>
                        {t.action === 'BUY' ? '-' : '+'}${parseFloat(t.total).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-neutral-600">
                        <div>{date}</div>
                        <div className="text-xs text-neutral-500">{time}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {sortedTransactions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No transactions found</h3>
            <p className="text-neutral-600">No transactions match your current filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;