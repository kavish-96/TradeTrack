import React, { useCallback, useEffect, useState } from 'react';
import { cacheGet, cacheSet } from '../../lib/sessionCache';

const MarketOverview = () => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Market indices symbols
  const marketIndices = [
    { symbol: '^NSEI', name: 'Nifty 50' },      // Nifty 50
    { symbol: '^IXIC', name: 'NASDAQ' },        // NASDAQ
    { symbol: '^GSPC', name: 'S&P 500' }        // S&P 500
  ];

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    try {
      const symbols = marketIndices.map(i => i.symbol);
      console.log("Fetching market data for symbols:", symbols);   // 👈 DEBUG
      const response = await fetch(`http://localhost:8000/api/market/market-indices/?${symbols.map(s => `symbols=${encodeURIComponent(s)}`).join('&')}`);

      console.log("API response status:", response.status);       // 👈 DEBUG
      const data = await response.json();
      console.log("API response JSON:", data);
      const marketData = data.map(item => {
        if (item.price !== undefined && item.previous_close !== undefined && item.change !== undefined && item.change_percent !== undefined) {
          return {
            name: item.name || item.symbol,
            value: item.price.toFixed(2),
            previousClose: item.previous_close.toFixed(2),
            change: item.change >= 0 ? `+${item.change.toFixed(2)}` : item.change.toFixed(2),
            changePercent: item.change_percent >= 0 ? `+${item.change_percent.toFixed(2)}%` : `${item.change_percent.toFixed(2)}%`,
            isPositive: item.change >= 0
          };
        } else {
          return {
            name: item.name || item.symbol,
            value: '--',
            previousClose: '--',
            change: '--',
            changePercent: '--',
            isPositive: null
          };
        }
      });
      setIndices(marketData);
      cacheSet('dashboard:marketOverview', marketData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from session cache on mount only; ensure no auto-fetches
  useEffect(() => {
    const cached = cacheGet('dashboard:marketOverview');
    if (cached) setIndices(cached);
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        {/* <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2> */}
        <button className="btn-secondary text-sm" onClick={async () => { sessionStorage.setItem('allow_market_fetch', '1'); try { await fetchMarketData(); } finally { sessionStorage.removeItem('allow_market_fetch'); } }} disabled={loading}>
          {loading ? 'Loading...' : (indices.length ? 'Refresh' : 'Load Data')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(indices.length ? indices : marketIndices.map((i) => ({ name: i.name, value: '--', previousClose: '--', change: '--', changePercent: '--', isPositive: null }))).map((index) => (
          <div key={index.name} className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{index.name}</h3>
            <div className="text-2xl font-bold text-gray-900 mb-1">{index.value}</div>
            <div className="text-xs text-gray-500 mb-1">Prev Close: {index.previousClose}</div>
            <div className={`text-sm font-medium ${
              index.isPositive === null ? 'text-gray-500' : 
              index.isPositive ? 'text-success-600' : 'text-error-600'
            }`}>
              {index.isPositive !== null && (
                <span className="mr-1">{index.isPositive ? '↗' : '↘'}</span>
              )}
              {index.change} ({index.changePercent})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;