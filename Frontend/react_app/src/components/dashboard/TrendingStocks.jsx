import React, { useCallback, useEffect, useState } from 'react';
import { getSimpleQuoteQueued } from '../../lib/marketQueue';
import { cacheGet, cacheSet } from '../../lib/sessionCache';

const TrendingStocks = () => {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Popular tech stocks to show as trending
  const stockSymbols = ['TSLA', 'AAPL', 'NVDA', 'AMZN', 'GOOGL'];

  const fetchTrendingStocks = useCallback(async () => {
    setLoading(true);
    try {
      const stocksData = [];
      for (const symbol of stockSymbols) {
        try {
          const quote = await getSimpleQuoteQueued(symbol);
          if (quote && quote.price) {
            const currentPrice = parseFloat(quote.price);
            const previousClose = parseFloat(quote.previous_close || 0);
            const changePercent = previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0;
            const isPositive = changePercent >= 0;
            stocksData.push({
              symbol: symbol,
              name: quote.name || symbol,
              price: `$${currentPrice.toFixed(2)}`,
              change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
              trend: isPositive ? '📈' : '📉',
              isPositive: isPositive
            });
          }
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          stocksData.push({
            symbol: symbol,
            name: symbol,
            price: '--',
            change: '--',
            trend: '📊',
            isPositive: null
          });
        }
      }
      setTrendingStocks(stocksData);
      cacheSet('dashboard:trending', stocksData);
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from session cache on mount; do not auto-fetch
  useEffect(() => {
    const cached = cacheGet('dashboard:trending');
    if (cached) setTrendingStocks(cached);
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trending Stocks</h3>
        <button className="btn-secondary text-sm" onClick={fetchTrendingStocks} disabled={loading}>
          {loading ? 'Loading...' : (trendingStocks.length ? 'Refresh' : 'Load Data')}
        </button>
      </div>
      <div className="space-y-3">
        {(trendingStocks.length ? trendingStocks : stockSymbols.map((s) => ({ symbol: s, name: s, price: '--', change: '--', trend: '📊', isPositive: null }))).map((stock) => (
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
                stock.isPositive === null ? 'text-gray-500' :
                stock.isPositive ? 'text-success-600' : 'text-error-600'
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