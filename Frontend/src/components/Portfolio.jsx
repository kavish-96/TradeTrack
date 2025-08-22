// import React, { useEffect, useState } from 'react';
// import { apiGet, apiPost, apiDelete } from '../lib/api';
// import { getSimpleQuoteQueued } from '../lib/marketQueue';
// import { cacheGet, cacheSet } from '../lib/sessionCache';

// const Portfolio = () => {
//   const [portfolio, setPortfolio] = useState([]);
//   const [prices, setPrices] = useState({}); // symbol -> number
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', purchasePrice: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const load = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await apiGet('/api/portfolio/positions/');
//       setPortfolio(data);
//     } catch (e) {
//       setError('Failed to load positions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   // Restore last known prices from session cache on mount
//   useEffect(() => {
//     const cached = cacheGet('portfolio:prices');
//     if (cached) setPrices(cached);
//   }, []);

//   // Manual per-stock price load
//   const loadPrice = async (symbol) => {
//     try {
//       sessionStorage.setItem('allow_market_fetch', '1');
//       const q = await getSimpleQuoteQueued(symbol);
//       const next = { ...prices };
//       if (q && q.price) next[symbol] = parseFloat(q.price);
//       setPrices(next);
//       cacheSet('portfolio:prices', next);
//     } catch (_) {}
//     finally {
//       sessionStorage.removeItem('allow_market_fetch');
//     }
//   };

//   const handleAddPosition = async () => {
//     if (!(newPosition.symbol && newPosition.quantity && newPosition.purchasePrice)) return;
//     try {
//       const payload = {
//         symbol: newPosition.symbol.toUpperCase(),
//         name: `${newPosition.symbol} Inc`,
//         quantity: parseInt(newPosition.quantity, 10),
//         purchase_price: parseFloat(newPosition.purchasePrice),
//       };
//       const created = await apiPost('/api/portfolio/positions/', payload);
//       setPortfolio([...portfolio, created]);
//       setNewPosition({ symbol: '', quantity: '', purchasePrice: '' });
//       setShowAddModal(false);
//     } catch (e) {
//       setError('Failed to add position');
//     }
//   };

//   const removePosition = async (id) => {
//     try {
//       await apiDelete(`/api/portfolio/positions/${id}/`);
//       setPortfolio(portfolio.filter((p) => p.id !== id));
//     } catch (e) {
//       setError('Failed to remove position');
//     }
//   };

//   const totalInvested = portfolio.reduce((sum, s) => sum + (s.quantity * parseFloat(s.purchase_price)), 0);
//   const totalCurrentValue = portfolio.reduce((sum, s) => sum + (s.quantity * (prices[s.symbol] ?? 0)), 0);
//   const totalPL = totalCurrentValue - totalInvested;
//   const totalPLPercent = totalInvested ? (totalPL / totalInvested) * 100 : 0;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
//         <p className="text-gray-600">Manage your stock investments and track performance</p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Total Invested</h3><div className="text-2xl font-bold text-gray-900">${totalInvested.toFixed(2)}</div></div>
//         <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Current Value</h3><div className="text-2xl font-bold text-gray-900">${totalCurrentValue.toFixed(2)}</div></div>
//         <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Total P&L</h3><div className={`text-2xl font-bold ${totalPL >= 0 ? 'text-success-600' : 'text-error-600'}`}>{totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}</div></div>
//         <div className="card p-6"><h3 className="text-sm font-medium text-gray-600 mb-1">Overall Return</h3><div className={`text-2xl font-bold ${totalPLPercent >= 0 ? 'text-success-600' : 'text-error-600'}`}>{totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%</div></div>
//       </div>
//       <div className="flex justify-between items-center mb-6">
//         <button onClick={() => setShowAddModal(true)} className="btn-primary">Add Position</button>
//         <div className="flex space-x-2">
//           <button className="btn-secondary">Export CSV</button>
//           <button className="btn-secondary">Export PDF</button>
//         </div>
//       </div>
    //   <div className="card overflow-hidden">
    //     <div className="overflow-x-auto">
    //       <table className="min-w-full divide-y divide-gray-200">
    //         <thead className="bg-gray-50">
    //           <tr>
    //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
    //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
    //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
    //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
    //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    //           </tr>
    //         </thead>
    //         <tbody className="bg-white divide-y divide-gray-200">
    //           {portfolio.map((stock) => (
    //             <tr key={stock.id} className="hover:bg-gray-50">
    //               <td className="px-6 py-4 whitespace-nowrap">
    //                 <div>
    //                   <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
    //                   <div className="text-sm text-gray-500">{stock.name}</div>
    //                 </div>
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.quantity}</td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(stock.purchase_price).toFixed(2)}</td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prices[stock.symbol] != null ? `$${prices[stock.symbol].toFixed(2)}` : '--'}</td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
    //                 <button onClick={() => loadPrice(stock.symbol)} className="text-primary-600 hover:text-primary-900">Load Price</button>
    //                 <button onClick={() => removePosition(stock.id)} className="text-error-600 hover:text-error-900">Remove</button>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>

    //   {showAddModal && (
    //     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    //       <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    //         <div className="mt-3">
    //           <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Position</h3>
    //           <div className="space-y-4">
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol</label>
    //               <input type="text" value={newPosition.symbol} onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value })} className="input-field" placeholder="e.g., AAPL" />
    //             </div>
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
    //               <input type="number" value={newPosition.quantity} onChange={(e) => setNewPosition({ ...newPosition, quantity: e.target.value })} className="input-field" placeholder="Number of shares" />
    //             </div>
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
    //               <input type="number" step="0.01" value={newPosition.purchasePrice} onChange={(e) => setNewPosition({ ...newPosition, purchasePrice: e.target.value })} className="input-field" placeholder="Price per share" />
    //             </div>
    //           </div>
    //           <div className="flex justify-end space-x-2 mt-6">
    //             <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
    //             <button onClick={handleAddPosition} className="btn-primary">Add Position</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   {error && <div className="text-error-600 text-sm mt-4">{error}</div>}
    //   {loading && <div className="text-gray-500 mt-2">Loading...</div>}
    // </div>
//   );
// };

// export default Portfolio;





import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '../lib/api';
import { getSimpleQuoteQueued } from '../lib/marketQueue';
import { cacheGet, cacheSet } from '../lib/sessionCache';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', purchasePrice: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet('/api/portfolio/positions/');
      setPortfolio(data);
    } catch (e) {
      setError('Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const cached = cacheGet('portfolio:prices');
    if (cached) setPrices(cached);
  }, []);

  const loadPrice = async (symbol) => {
    try {
      sessionStorage.setItem('allow_market_fetch', '1');
      const q = await getSimpleQuoteQueued(symbol);
      const next = { ...prices };
      if (q && q.price) next[symbol] = parseFloat(q.price);
      setPrices(next);
      cacheSet('portfolio:prices', next);
    } catch (_) {}
    finally {
      sessionStorage.removeItem('allow_market_fetch');
    }
  };

  const handleAddPosition = async () => {
    if (!(newPosition.symbol && newPosition.quantity && newPosition.purchasePrice)) return;
    try {
      const payload = {
        symbol: newPosition.symbol.toUpperCase(),
        name: `${newPosition.symbol} Inc`,
        quantity: parseInt(newPosition.quantity, 10),
        purchase_price: parseFloat(newPosition.purchasePrice),
      };
      const created = await apiPost('/api/portfolio/positions/', payload);
      setPortfolio([...portfolio, created]);
      setNewPosition({ symbol: '', quantity: '', purchasePrice: '' });
      setShowAddModal(false);
    } catch (e) {
      setError('Failed to add position');
    }
  };

  const removePosition = async (id) => {
    try {
      await apiDelete(`/api/portfolio/positions/${id}/`);
      setPortfolio(portfolio.filter((p) => p.id !== id));
    } catch (e) {
      setError('Failed to remove position');
    }
  };

  // ---------------- EXPORT FUNCTIONS ----------------
  // Export CSV
  const handleExportCSV = () => {
    const header = ["Symbol", "Name", "Quantity", "Purchase Price", "Current Price"];
    const rows = portfolio.map((stock) => [
      stock.symbol,
      stock.name,
      stock.quantity,
      parseFloat(stock.purchase_price).toFixed(2),
      prices[stock.symbol] != null ? prices[stock.symbol].toFixed(2) : "--",
    ]);

    const csvContent =
      [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "portfolio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Portfolio Report", 14, 22);

    const tableColumn = ["Symbol", "Name", "Quantity", "Purchase Price", "Current Price"];
    const tableRows = portfolio.map((stock) => [
      stock.symbol,
      stock.name,
      stock.quantity,
      `$${parseFloat(stock.purchase_price).toFixed(2)}`,
      prices[stock.symbol] != null ? `$${prices[stock.symbol].toFixed(2)}` : "--",
    ]);

    // Use imported autoTable function
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("portfolio.pdf");
  };
  // --------------------------------------------------

  const totalInvested = portfolio.reduce((sum, s) => sum + (s.quantity * parseFloat(s.purchase_price)), 0);
  const totalCurrentValue = portfolio.reduce((sum, s) => sum + (s.quantity * (prices[s.symbol] ?? 0)), 0);
  const totalPL = totalCurrentValue - totalInvested;
  const totalPLPercent = totalInvested ? (totalPL / totalInvested) * 100 : 0;

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
                  <p className="text-white/90 text-lg">Manage your stock investments and track performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">${totalInvested.toLocaleString()} invested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">{portfolio.length} positions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className={`text-sm font-medium ${totalPL >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                    {totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}% return
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-blue-700">Total Invested</h3>
          </div>
          <div className="text-3xl font-bold text-blue-900">${totalInvested.toFixed(2)}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-green-700">Current Value</h3>
          </div>
          <div className="text-3xl font-bold text-green-900">${totalCurrentValue.toFixed(2)}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-purple-700">Total P&L</h3>
          </div>
          <div className={`text-3xl font-bold ${totalPL >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-orange-700">Overall Return</h3>
          </div>
          <div className={`text-3xl font-bold ${totalPLPercent >= 0 ? 'text-orange-900' : 'text-red-900'}`}>
            {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6 flex justify-between items-center">
        <button 
          onClick={() => setShowAddModal(true)} 
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Position</span>
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV} 
            className="px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button 
            onClick={handleExportPDF} 
            className="px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Purchase Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {portfolio.map((stock) => (
                <tr key={stock.id} className="hover:bg-neutral-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-neutral-900">{stock.symbol}</div>
                      <div className="text-sm text-neutral-600">{stock.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-700 font-medium">{stock.quantity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-700 font-medium">${parseFloat(stock.purchase_price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-700 font-medium">
                      {prices[stock.symbol] != null ? `$${prices[stock.symbol].toFixed(2)}` : '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => loadPrice(stock.symbol)} 
                        className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors duration-200"
                      >
                        Load Price
                      </button>
                      <button 
                        onClick={() => removePosition(stock.id)} 
                        className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Add New Position</h3>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Stock Symbol</label>
                  <input 
                    type="text" 
                    value={newPosition.symbol} 
                    onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value })} 
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
                    placeholder="e.g., AAPL" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    value={newPosition.quantity} 
                    onChange={(e) => setNewPosition({ ...newPosition, quantity: e.target.value })} 
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Number of shares" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Purchase Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={newPosition.purchasePrice} 
                    onChange={(e) => setNewPosition({ ...newPosition, purchasePrice: e.target.value })} 
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Price per share" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="px-6 py-3 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPosition} 
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Add Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-center py-8">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-neutral-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading portfolio...
          </div>
        </div>
      )}
    </div>

  );
};

export default Portfolio;
