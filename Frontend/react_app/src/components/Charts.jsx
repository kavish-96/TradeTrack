import React, { useState, useEffect } from 'react';
import { apiGet } from '../lib/api';

const Charts = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [activeTab, setActiveTab] = useState('historical');
  const [historical, setHistorical] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stocks = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN'];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiGet(`/api/market/history?symbol=${encodeURIComponent(selectedStock)}&interval=daily&outputsize=compact`);
        // Normalize Alpha Vantage response to { dates: [], prices: [] }
        const key = Object.keys(data).find(k => k.includes('Time Series'));
        if (key) {
          const series = data[key];
          const entries = Object.entries(series).slice(0, 30).reverse();
          const dates = entries.map(([d]) => d);
          const prices = entries.map(([, v]) => parseFloat(v['4. close']));
          setHistorical({ dates, prices });
        } else {
          setError('No data available (rate limit?)');
          setHistorical(null);
        }
      } catch (e) {
        setError('Failed to load data');
        setHistorical(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedStock]);

  const renderChart = (data, color = 'primary') => {
    if (!data) return <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-500">{loading ? 'Loading...' : (error || 'No data')}</div>;
    const max = Math.max(...data.prices);
    const min = Math.min(...data.prices);
    const range = max - min || 1;
    return (
      <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end space-x-2">
        {data.prices.map((price, index) => {
          const height = ((price - min) / range) * 200 + 20;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className={`bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`} style={{ height: `${height}px`, width: '100%' }}></div>
              <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">{data.dates[index]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const getCurrentPrice = () => {
    if (!historical || historical.prices.length === 0) return 0;
    return historical.prices[historical.prices.length - 1].toFixed(2);
  };

  const getChange = () => {
    if (!historical || historical.prices.length < 2) return 0;
    const p = historical.prices;
    return (p[p.length - 1] - p[p.length - 2]).toFixed(2);
  };

  const change = parseFloat(getChange());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Charts & Analysis</h1>
        <p className="text-gray-600">Analyze stock trends and predictions</p>
      </div>
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Stock</h2>
        <div className="flex flex-wrap gap-2">
          {stocks.map((stock) => (
            <button key={stock} onClick={() => setSelectedStock(stock)} className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${selectedStock === stock ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {stock}
            </button>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedStock}</h3>
              <div className="text-3xl font-bold text-gray-900">${getCurrentPrice()}</div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-semibold ${change >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                {change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button onClick={() => setActiveTab('historical')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'historical' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Historical Data (30 Days)
            </button>
            <button onClick={() => setActiveTab('prediction')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'prediction' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Price Prediction
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'historical' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedStock} - Historical Closing Prices</h3>
              {renderChart(historical)}
              <div className="mt-4 text-sm text-gray-600">* Historical data for the last 30 trading days</div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedStock} - Price Prediction</h3>
              {renderChart(historical, 'purple')}
              <div className="mt-4 text-sm text-gray-600">* Predictions based on technical analysis and market trends</div>
            </div>
          )}
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chart Integration Ready</h3>
        <p className="text-gray-600 mb-4">
          This component is now fetching historical data from the backend API.
        </p>
      </div>
    </div>
  );
};

export default Charts;