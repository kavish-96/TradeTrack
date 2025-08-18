import React, { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { getSimpleQuoteQueued } from '../../lib/marketQueue';

const PortfolioSummary = () => {
  const [positions, setPositions] = useState([]);
  const [prices, setPrices] = useState({});
  const [todayPerformance, setTodayPerformance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        // Fetch portfolio positions
        const portfolioResponse = await apiGet('/api/portfolio/positions/');
        setPositions(portfolioResponse);

        // Fetch current prices for all positions
        const priceMap = {};
        for (const position of portfolioResponse) {
          try {
            const quote = await getSimpleQuoteQueued(position.symbol);
            if (quote && quote.price) {
              priceMap[position.symbol] = parseFloat(quote.price);
            }
          } catch (error) {
            console.error(`Error fetching price for ${position.symbol}:`, error);
          }
        }
        setPrices(priceMap);

        // Fetch today's transactions (last 24 hours)
        const transactionsResponse = await apiGet('/api/trades/');
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        const todayTransactions = transactionsResponse.filter(transaction => {
          const transactionDate = new Date(transaction.created_at);
          return transactionDate >= last24Hours;
        });

        // Calculate net flow for today
        let netFlow = 0;
        todayTransactions.forEach(transaction => {
          if (transaction.action === 'BUY') {
            netFlow -= parseFloat(transaction.total);
          } else if (transaction.action === 'SELL') {
            netFlow += parseFloat(transaction.total);
          }
        });
        
        setTodayPerformance(netFlow);

      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  // Calculate portfolio metrics
  const totalInvested = positions.reduce((sum, position) => {
    return sum + (position.quantity * parseFloat(position.purchase_price));
  }, 0);

  const totalCurrentValue = positions.reduce((sum, position) => {
    const currentPrice = prices[position.symbol] || 0;
    return sum + (position.quantity * currentPrice);
  }, 0);

  const totalPL = totalCurrentValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  // Get top 3 holdings by current value
  const topHoldings = positions
    .map(position => {
      const currentPrice = prices[position.symbol] || 0;
      const currentValue = position.quantity * currentPrice;
      const investedValue = position.quantity * parseFloat(position.purchase_price);
      const pl = currentValue - investedValue;
      const plPercent = investedValue > 0 ? (pl / investedValue) * 100 : 0;
      
      return {
        symbol: position.symbol,
        name: position.name || position.symbol,
        value: currentValue,
        pl: pl,
        plPercent: plPercent
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Value</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">${totalCurrentValue.toFixed(2)}</div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Total P&L:</span>
            <span className={`font-medium ${totalPL >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              {totalPL >= 0 ? '↗' : '↘'} ${Math.abs(totalPL).toFixed(2)} ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
          <div className={`text-3xl font-bold mb-2 ${todayPerformance >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            ${Math.abs(todayPerformance).toFixed(2)}
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Net Flow:</span>
            <span className={`font-medium ${todayPerformance >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              {todayPerformance >= 0 ? '↗' : '↘'} {todayPerformance >= 0 ? '+' : '-'}${Math.abs(todayPerformance).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Holdings</h3>
        <div className="space-y-4">
          {topHoldings.length > 0 ? (
            topHoldings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">{holding.symbol}</div>
                  <div className="text-sm text-gray-600">{holding.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${holding.value.toFixed(2)}</div>
                  <div className={`text-sm font-medium ${
                    holding.pl >= 0 ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {holding.pl >= 0 ? '+' : ''}${holding.pl.toFixed(2)} ({holding.plPercent >= 0 ? '+' : ''}{holding.plPercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No positions in portfolio yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;