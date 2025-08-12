import React, { useState } from 'react';

const Charts = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [activeTab, setActiveTab] = useState('historical');

  const stocks = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN'];
  
  // Mock historical data
  const historicalData = {
    dates: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
    prices: [150, 155, 152, 158, 162, 159, 165]
  };
  
  // Mock prediction data
  const predictionData = {
    dates: ['Feb 1', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20', 'Feb 25', 'Feb 28'],
    prices: [167, 170, 168, 172, 175, 173, 178]
  };

  const renderChart = (data, color = 'primary') => {
    const max = Math.max(...data.prices);
    const min = Math.min(...data.prices);
    const range = max - min;
    
    return (
      <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end space-x-2">
        {data.prices.map((price, index) => {
          const height = ((price - min) / range) * 200 + 20;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
                style={{ height: `${height}px`, width: '100%' }}
              ></div>
              <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                {data.dates[index]}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getCurrentPrice = () => {
    const prices = { AAPL: 189.25, GOOGL: 125.89, TSLA: 245.67, MSFT: 378.45, AMZN: 128.44 };
    return prices[selectedStock] || 0;
  };

  const getChange = () => {
    const changes = { AAPL: 4.23, GOOGL: -2.14, TSLA: 12.45, MSFT: -5.67, AMZN: 1.89 };
    return changes[selectedStock] || 0;
  };

  const change = getChange();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Charts & Analysis</h1>
        <p className="text-gray-600">Analyze stock trends and predictions</p>
      </div>

      {/* Stock Selection */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Stock</h2>
        <div className="flex flex-wrap gap-2">
          {stocks.map((stock) => (
            <button
              key={stock}
              onClick={() => setSelectedStock(stock)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                selectedStock === stock
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
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
              <div className={`text-lg font-semibold ${
                change >= 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                {change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)}
              </div>
              <div className={`text-sm ${
                change >= 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                ({change >= 0 ? '+' : ''}{((change / getCurrentPrice()) * 100).toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="card mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('historical')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'historical'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historical Data (30 Days)
            </button>
            <button
              onClick={() => setActiveTab('prediction')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prediction'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Price Prediction
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'historical' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStock} - Historical Closing Prices
              </h3>
              {renderChart(historicalData)}
              <div className="mt-4 text-sm text-gray-600">
                * Historical data for the last 30 trading days
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStock} - Price Prediction
              </h3>
              {renderChart(predictionData, 'purple')}
              <div className="mt-4 text-sm text-gray-600">
                * Predictions based on technical analysis and market trends
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Integration Notice */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chart Integration Ready</h3>
        <p className="text-gray-600 mb-4">
          This component is ready for integration with advanced charting libraries like Chart.js, 
          D3.js, or TradingView widgets for real-time interactive charts.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Available Chart Types:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Candlestick charts for detailed price analysis</li>
            <li>• Volume charts with price correlation</li>
            <li>• Technical indicators (RSI, MACD, Moving Averages)</li>
            <li>• Real-time streaming data integration</li>
            <li>• Interactive zoom and pan functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Charts;