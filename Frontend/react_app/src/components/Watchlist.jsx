import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '../lib/api';
import { getSimpleQuoteQueued, getOverviewQueued } from '../lib/marketQueue';

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

  useEffect(() => {
    const fetchPrices = async () => {
      const map = {};
      for (const it of items) {
        try {
          const q = await getSimpleQuoteQueued(it.symbol);
          map[it.symbol] = {
            price: q.price ? parseFloat(q.price) : null,
            change: q.change ? parseFloat(q.change) : null,
          };
        } catch (_) {}
      }
      setPrices(map);
    };
    if (items.length) fetchPrices();
  }, [items]);

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
      const data = await getOverviewQueued(symbol);
      setDetails({ symbol, data });
    } catch (_) {
      setDetails({ symbol, data: { Note: 'Failed to load details (rate limit?)' } });
    } finally {
      setDetailsLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Watchlist</h1>
        <p className="text-gray-600">Track your favorite stocks and monitor their performance</p>
      </div>
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Stock to Watchlist</h2>
        <div className="flex gap-4">
          <input type="text" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="Enter stock symbol (e.g., AAPL)" className="input-field flex-1" />
          <button onClick={addStock} className="btn-primary" disabled={adding}>{adding ? 'Adding...' : 'Add Stock'}</button>
        </div>
        {error && <div className="text-error-600 text-sm mt-2">{error}</div>}
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto">
            <option value="symbol">Symbol</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">{items.length} stocks in watchlist</div>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((stock) => {
            const p = prices[stock.symbol] || {};
            const priceStr = p.price != null ? `$${p.price.toFixed(2)}` : '--';
            const arrow = p.change == null ? '' : (p.change >= 0 ? '▲' : '▼');
            const arrowClass = p.change == null ? 'text-gray-400' : (p.change >= 0 ? 'text-success-600' : 'text-error-600');
            return (
              <div key={stock.id} className="card p-6 hover:shadow-md transition duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <button onClick={() => removeStock(stock.id)} className="text-gray-400 hover:text-error-600 transition duration-200">✕</button>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <span>{priceStr}</span>
                      <span className={`${arrowClass} text-base`}>{arrow}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-500">{p.change != null ? `${p.change >= 0 ? '+' : ''}${p.change.toFixed(2)}` : ''}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-secondary flex-1 py-2 text-sm" onClick={() => viewDetails(stock.symbol)}>View Details</button>
                  <button className="btn-primary flex-1 py-2 text-sm" onClick={() => addToPortfolio(stock.symbol, stock.name)}>Add to Portfolio</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👁️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks in watchlist</h3>
          <p className="text-gray-600">Add some stocks to start tracking their performance</p>
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