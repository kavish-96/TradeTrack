import React from 'react';

const PortfolioSummary = () => {
  const portfolioData = {
    totalValue: '₹2,45,678',
    totalInvested: '₹2,10,000',
    totalPL: '₹35,678',
    totalPLPercent: '16.99%',
    dayPL: '₹2,341',
    dayPLPercent: '0.96%'
  };

  const topHoldings = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', value: '₹45,230', pl: '+₹5,230', plPercent: '+13.1%' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', value: '₹38,950', pl: '+₹3,450', plPercent: '+9.7%' },
    { symbol: 'INFY', name: 'Infosys Limited', value: '₹32,100', pl: '-₹1,200', plPercent: '-3.6%' },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Value</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">{portfolioData.totalValue}</div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Total P&L:</span>
            <span className="text-success-600 font-medium">
              ↗ {portfolioData.totalPL} ({portfolioData.totalPLPercent})
            </span>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
          <div className="text-3xl font-bold text-success-600 mb-2">{portfolioData.dayPL}</div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Day P&L:</span>
            <span className="text-success-600 font-medium">
              ↗ {portfolioData.dayPLPercent}
            </span>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Holdings</h3>
        <div className="space-y-4">
          {topHoldings.map((holding) => (
            <div key={holding.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">{holding.symbol}</div>
                <div className="text-sm text-gray-600">{holding.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{holding.value}</div>
                <div className={`text-sm font-medium ${
                  holding.pl.startsWith('+') ? 'text-success-600' : 'text-error-600'
                }`}>
                  {holding.pl} ({holding.plPercent})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;