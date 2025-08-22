import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '../lib/api';
import { getSimpleQuoteQueued, getOverviewQueued } from '../lib/marketQueue';
import { cacheGet, cacheSet } from '../lib/sessionCache';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({}); // symbol -> { price, change }
  const [newStock, setNewStock] = useState('');
  const [sortBy, setSortBy] = useState('symbol');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [details, setDetails] = useState(null); // { symbol, data }
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet('/api/watchlist/');
      setItems(data);
    } catch (e) {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Restore last known prices from session cache on mount
  useEffect(() => {
    const cached = cacheGet('watchlist:prices');
    if (cached) setPrices(cached);
  }, []);

  // Manual per-stock price load to reduce API requests
  const loadPrice = async (symbol) => {
    try {
      sessionStorage.setItem('allow_market_fetch', '1');
      const q = await getSimpleQuoteQueued(symbol);
      const next = {
        ...prices,
        [symbol]: {
          price: q.price ? parseFloat(q.price) : null,
          change: q.change ? parseFloat(q.change) : null,
        },
      };
      setPrices(next);
      cacheSet('watchlist:prices', next);
    } catch (_) {}
    finally {
      sessionStorage.removeItem('allow_market_fetch');
    }
  };

  const removeStock = async (id) => {
    try {
      await apiDelete(`/api/watchlist/${id}/`);
      setItems(items.filter((s) => s.id !== id));
    } catch (e) {
      setError('Failed to remove');
    }
  };

  const addStock = async () => {
    if (!newStock.trim()) return;
    setAdding(true);
    setError('');
    try {
      const created = await apiPost('/api/market/add-to-watchlist/', { symbol: newStock });
      const exists = items.find((i) => i.symbol === created.symbol);
      setItems(exists ? items : [...items, created]);
      setNewStock('');
    } catch (e) {
      const data = e.data || {};
      const msg = typeof data === 'object' && (data.symbol || data.detail) ? (data.symbol || data.detail) : 'Failed to add';
      setError(msg);
    } finally {
      setAdding(false);
    }
  };

  const viewDetails = async (symbol) => {
    setDetails({ symbol, data: null });
    setDetailsLoading(true);
    try {
      sessionStorage.setItem('allow_market_fetch', '1');
      const data = await getOverviewQueued(symbol);
      setDetails({ symbol, data });
    } catch (_) {
      setDetails({ symbol, data: { Note: 'Failed to load details (rate limit?)' } });
    } finally {
      setDetailsLoading(false);
      sessionStorage.removeItem('allow_market_fetch');
    }
  };

  const closeDetails = () => setDetails(null);

  const addToPortfolio = (symbol, name) => {
    const ev = new CustomEvent('open-add-position', { detail: { symbol, name } });
    window.dispatchEvent(ev);
    localStorage.setItem('currentPage', 'portfolio');
    window.location.reload();
  };

  const sorted = [...items].sort((a, b) => (sortBy === 'symbol' ? a.symbol.localeCompare(b.symbol) : a.name.localeCompare(b.name)));

  const renderOverviewSections = (data) => {
    if (!data) return <div className="text-gray-500">Loading details...</div>;
    const get = (k) => data?.[k] ?? '-';
    const company = [
      { label: 'Name', value: get('Name') },
      { label: 'Symbol', value: get('Symbol') },
      { label: 'Exchange', value: get('Exchange') },
      { label: 'Sector', value: get('Sector') },
      { label: 'Industry', value: get('Industry') },
      { label: 'Country', value: get('Country') },
    ];
    const metrics = [
      { label: 'Market Cap', value: get('MarketCapitalization') },
      { label: 'P/E Ratio', value: get('PERatio') },
      { label: 'EPS', value: get('EPS') },
      { label: 'Dividend Yield', value: get('DividendYield') },
      { label: '52W High', value: get('52WeekHigh') },
      { label: '52W Low', value: get('52WeekLow') },
    ];
    const extra = [
      { label: 'Beta', value: get('Beta') },
      { label: '50D MA', value: get('50DayMovingAverage') },
      { label: '200D MA', value: get('200DayMovingAverage') },
      { label: 'Analyst Target', value: get('AnalystTargetPrice') },
      { label: 'Profit Margin', value: get('ProfitMargin') },
    ];
    const description = get('Description');

    const Section = ({ title, items }) => (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((it) => (
            <div key={it.label} className="flex justify-between">
              <span className="text-gray-600 mr-2">{it.label}</span>
              <span className="text-gray-900 text-right break-words">{it.value}</span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div>
        <Section title="Company" items={company} />
        <Section title="Key Metrics" items={metrics} />
        <Section title="Additional" items={extra} />
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    );
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Watchlist</h1>
                  <p className="text-white/90 text-lg">Track your favorite stocks and monitor their performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">{items.length} stocks tracked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Real-time updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Portfolio integration</span>
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

      {/* Add Stock Section - Inline Form */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input 
              type="text" 
              value={newStock} 
              onChange={(e) => setNewStock(e.target.value)} 
              placeholder="Enter stock symbol (e.g., AAPL)" 
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
            />
          </div>
          <button 
            onClick={addStock} 
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50" 
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add Stock'}
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

      {/* Controls Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-neutral-700">Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="symbol">Symbol</option>
            <option value="name">Name</option>
          </select>
          
          <div className="flex items-center space-x-2 ml-6">
            <label className="text-sm font-medium text-neutral-700">View:</label>
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Table
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'card'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Cards
              </button>
            </div>
          </div>
        </div>
        <div className="text-sm text-neutral-600 bg-neutral-100 px-3 py-2 rounded-lg">
          {items.length} stocks in watchlist
        </div>
      </div>

      {/* Stock List - Conditional Rendering */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-neutral-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading watchlist...
          </div>
        </div>
      ) : viewMode === 'table' ? (
        // Table View
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/3">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/6">Current Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/6">Change</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {sorted.map((stock) => {
                  const p = prices[stock.symbol] || {};
                  const priceStr = p.price != null ? `$${p.price.toFixed(2)}` : '--';
                  const arrow = p.change == null ? '' : (p.change >= 0 ? '▲' : '▼');
                  const arrowClass = p.change == null ? 'text-neutral-400' : (p.change >= 0 ? 'text-success-600' : 'text-error-600');
                  return (
                    <tr key={stock.id} className="hover:bg-neutral-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-lg font-bold text-neutral-900">{stock.symbol}</div>
                          <div className="text-sm text-neutral-600">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-neutral-900">{priceStr}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-base ${arrowClass}`}>{arrow}</span>
                          <span className={`text-base font-medium ${arrowClass}`}>
                            {p.change != null ? `${p.change >= 0 ? '+' : ''}${p.change.toFixed(2)}` : '--'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3">
                          <button 
                            onClick={() => loadPrice(stock.symbol)} 
                            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors duration-200"
                          >
                            Load Price
                          </button>
                          <button 
                            onClick={() => viewDetails(stock.symbol)} 
                            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors duration-200"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => addToPortfolio(stock.symbol, stock.name)} 
                            className="px-3 py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                          >
                            Add to Portfolio
                          </button>
                          <button 
                            onClick={() => removeStock(stock.id)} 
                            className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Card View (Original UI)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((stock) => {
            const p = prices[stock.symbol] || {};
            const priceStr = p.price != null ? `$${p.price.toFixed(2)}` : '--';
            const arrow = p.change == null ? '' : (p.change >= 0 ? '▲' : '▼');
            const arrowClass = p.change == null ? 'text-neutral-400' : (p.change >= 0 ? 'text-success-600' : 'text-error-600');
            
            return (
              <div key={stock.id} className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{stock.symbol}</h3>
                    <p className="text-sm text-neutral-600">{stock.name}</p>
                  </div>
                  <button
                    onClick={() => removeStock(stock.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-neutral-900 mb-2">{priceStr}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg ${arrowClass}`}>{arrow}</span>
                    <span className={`text-lg font-medium ${arrowClass}`}>
                      {p.change != null ? `${p.change >= 0 ? '+' : ''}${p.change.toFixed(2)}` : '--'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => loadPrice(stock.symbol)}
                    className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors duration-200"
                  >
                    Load Price
                  </button>
                  <button
                    onClick={() => viewDetails(stock.symbol)}
                    className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors duration-200"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToPortfolio(stock.symbol, stock.name)}
                    className="px-3 py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                  >
                    Add to Portfolio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-lg">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No stocks in watchlist</h3>
          <p className="text-neutral-600">Add some stocks above to start tracking their performance</p>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={closeDetails}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{details.symbol} Overview</h3>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {renderOverviewSections(details.data)}
            </div>
            <div className="p-4 border-t text-right">
              <button className="btn-primary" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;