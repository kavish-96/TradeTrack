import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '../lib/api';
import { getSimpleQuoteQueued } from '../lib/marketQueue';
import { cacheGet, cacheSet } from '../lib/sessionCache';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({}); // symbol -> number
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', purchasePrice: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet('/api/portfolio/positions/');
      setPortfolio(data);
    } catch (e) {
      setError('Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Restore last known prices from session cache on mount
  useEffect(() => {
    const cached = cacheGet('portfolio:prices');
    if (cached) setPrices(cached);
  }, []);

  // Manual per-stock price load
  const loadPrice = async (symbol) => {
    try {
      sessionStorage.setItem('allow_market_fetch', '1');
      const q = await getSimpleQuoteQueued(symbol);
      const next = { ...prices };
      if (q && q.price) next[symbol] = parseFloat(q.price);
      setPrices(next);
      cacheSet('portfolio:prices', next);
    } catch (_) {}
    finally {
      sessionStorage.removeItem('allow_market_fetch');
    }
  };

  const handleAddPosition = async () => {
    if (!(newPosition.symbol && newPosition.quantity && newPosition.purchasePrice)) return;
    try {
      const payload = {
        symbol: newPosition.symbol.toUpperCase(),
        name: `${newPosition.symbol} Inc`,
        quantity: parseInt(newPosition.quantity, 10),
        purchase_price: parseFloat(newPosition.purchasePrice),
      };
      const created = await apiPost('/api/portfolio/positions/', payload);
      setPortfolio([...portfolio, created]);
      setNewPosition({ symbol: '', quantity: '', purchasePrice: '' });
      setShowAddModal(false);
    } catch (e) {
      setError('Failed to add position');
    }
  };

  const removePosition = async (id) => {
    try {
      await apiDelete(`/api/portfolio/positions/${id}/`);
      setPortfolio(portfolio.filter((p) => p.id !== id));
    } catch (e) {
      setError('Failed to remove position');
    }
  };

  const totalInvested = portfolio.reduce((sum, s) => sum + (s.quantity * parseFloat(s.purchase_price)), 0);
  const totalCurrentValue = portfolio.reduce((sum, s) => sum + (s.quantity * (prices[s.symbol] ?? 0)), 0);
  const totalPL = totalCurrentValue - totalInvested;
  const totalPLPercent = totalInvested ? (totalPL / totalInvested) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
        <p className="text-gray-600">Manage your stock investments and track performance</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Total Invested</h3><div className="text-2xl font-bold text-gray-900">${totalInvested.toFixed(2)}</div></div>
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Current Value</h3><div className="text-2xl font-bold text-gray-900">${totalCurrentValue.toFixed(2)}</div></div>
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Total P&L</h3><div className={`text-2xl font-bold ${totalPL >= 0 ? 'text-success-600' : 'text-error-600'}`}>{totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}</div></div>
        <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Overall Return</h3><div className={`text-2xl font-bold ${totalPLPercent >= 0 ? 'text-success-600' : 'text-error-600'}`}>{totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%</div></div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setShowAddModal(true)} className="btn-primary">Add Position</button>
        <div className="flex space-x-2">
          <button className="btn-secondary">Export CSV</button>
          <button className="btn-secondary">Export PDF</button>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(stock.purchase_price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prices[stock.symbol] != null ? `$${prices[stock.symbol].toFixed(2)}` : '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button onClick={() => loadPrice(stock.symbol)} className="text-primary-600 hover:text-primary-900">Load Price</button>
                    <button onClick={() => removePosition(stock.id)} className="text-error-600 hover:text-error-900">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Position</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol</label>
                  <input type="text" value={newPosition.symbol} onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value })} className="input-field" placeholder="e.g., AAPL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" value={newPosition.quantity} onChange={(e) => setNewPosition({ ...newPosition, quantity: e.target.value })} className="input-field" placeholder="Number of shares" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                  <input type="number" step="0.01" value={newPosition.purchasePrice} onChange={(e) => setNewPosition({ ...newPosition, purchasePrice: e.target.value })} className="input-field" placeholder="Price per share" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleAddPosition} className="btn-primary">Add Position</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-error-600 text-sm mt-4">{error}</div>}
      {loading && <div className="text-gray-500 mt-2">Loading...</div>}
    </div>
  );
};

export default Portfolio;