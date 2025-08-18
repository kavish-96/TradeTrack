import React, { useEffect, useState } from 'react';
import { getSimpleQuoteQueued } from '../../lib/marketQueue';

const TrendingStocks = () => {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popular tech stocks to show as trending
  const stockSymbols = ['TSLA', 'AAPL', 'NVDA', 'AMZN', 'GOOGL'];

  useEffect(() => {
    const fetchTrendingStocks = async () => {
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
            // Add fallback data if API fails
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
      } catch (error) {
        console.error('Error fetching trending stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingStocks();
  }, []);

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Stocks</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="animate-pulse flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="animate-pulse text-right">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Stocks</h3>
      <div className="space-y-3">
        {trendingStocks.map((stock) => (
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