import React, { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { getSimpleQuoteQueued } from '../../lib/marketQueue';
import { cacheGet, cacheSet } from '../../lib/sessionCache';

const PortfolioSummary = () => {
  const [positions, setPositions] = useState([]);
  const [prices, setPrices] = useState({});
  const [todayPerformance, setTodayPerformance] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshSummary = useCallback(async () => {
    setLoading(true);
    try {
      const portfolioResponse = await apiGet('/api/portfolio/positions/');
      setPositions(portfolioResponse);
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
      cacheSet('dashboard:portfolio:positions', portfolioResponse);
      cacheSet('dashboard:portfolio:prices', priceMap);

      // Today performance from trades in last 24h
      const transactionsResponse = await apiGet('/api/trades/');
      const now = new Date();
      const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      const todayTransactions = transactionsResponse.filter(t => new Date(t.created_at) >= last24Hours);
      let netFlow = 0;
      todayTransactions.forEach(t => {
        if (t.action === 'BUY') netFlow -= parseFloat(t.total);
        else if (t.action === 'SELL') netFlow += parseFloat(t.total);
      });
      setTodayPerformance(netFlow);
      cacheSet('dashboard:portfolio:todayPerformance', netFlow);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from cache on mount; no auto-fetch
  useEffect(() => {
    const cachedPositions = cacheGet('dashboard:portfolio:positions');
    const cachedPrices = cacheGet('dashboard:portfolio:prices');
    const cachedPerf = cacheGet('dashboard:portfolio:todayPerformance');
    if (cachedPositions) setPositions(cachedPositions);
    if (cachedPrices) setPrices(cachedPrices);
    if (typeof cachedPerf === 'number') setTodayPerformance(cachedPerf);
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

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Value</h3>
            <button className="btn-secondary text-sm" onClick={refreshSummary} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">${totalCurrentValue.toFixed(2)}</div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Total P&L:</span>
            <span className={`font-medium ${totalPL >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              {totalPL >= 0 ? '↗' : '↘'} ${Math.abs(totalPL).toFixed(2)} ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Performance</h3>
            <button className="btn-secondary text-sm" onClick={refreshSummary} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Holdings</h3>
          <button className="btn-secondary text-sm" onClick={refreshSummary} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
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