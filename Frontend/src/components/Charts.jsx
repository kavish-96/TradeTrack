// import React, { useState, useEffect } from 'react';
// import { apiGet, apiPost } from '../lib/api';

// const Charts = () => {
//   const [selectedStock, setSelectedStock] = useState('');
//   const [search, setSearch] = useState('');
//   const [activeTab, setActiveTab] = useState('historical');
//   const [historical, setHistorical] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [prediction, setPrediction] = useState(null);
//   const [predictionLoading, setPredictionLoading] = useState(false);
//   const [modelExists, setModelExists] = useState(false);
//   const [retrainLoading, setRetrainLoading] = useState(false);

//   // fetch historical data
// useEffect(() => {
//   const load = async () => {
//     if (!selectedStock) return;
//     setLoading(true);
//     setError('');
//     try {
//       const data = await apiGet(`/api/predictor/historical/?symbol=${encodeURIComponent(selectedStock)}`);
//       if (Array.isArray(data) && data.length > 0) {
//         setHistorical({
//           dates: data.map(item => item.date),
//           prices: data.map(item => item.close_price),
//         });
//       } else {
//         setError('No historical data found.');
//         setHistorical(null);
//       }
//     } catch (e) {
//       console.error(e);
//       setError('Failed to load historical data');
//       setHistorical(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!selectedStock) {
//     setHistorical(null);
//     setPrediction(null);
//     setError('');
//     return;
//   }
//   load();
// }, [selectedStock]);

//   // check model existence
//   useEffect(() => {
//     const checkModel = async () => {
//       if (!selectedStock) return;
//       try {
//         const data = await apiGet(`/api/predictor/exists/?symbol=${selectedStock}`);
//         setModelExists(data.exists);
//       } catch {
//         setModelExists(false);
//       }
//     };
//     checkModel();
//   }, [selectedStock]);

//   // fetch prediction
//   const loadPrediction = async () => {
//     if (!selectedStock) return;
//     setPredictionLoading(true);
//     try {
//       const data = await apiGet(`/api/predictor/predict/?symbol=${selectedStock}&days=7`);
//       if (Array.isArray(data) && data.length > 0) {
//         setPrediction({
//           dates: data.map(item => item.date),
//           prices: data.map(item => item.predicted_close),
//         });
//       } else {
//         setPrediction(null);
//       }
//     } catch (e) {
//       console.error(e);
//       setPrediction(null);
//     } finally {
//       setPredictionLoading(false);
//     }
//   };


//   // retrain model
//   const handleRetrain = async () => {
//     setRetrainLoading(true);
//     try {
//       await apiPost(`/api/predictor/retrain/`, { symbol: selectedStock });
//       await loadPrediction();
//       setModelExists(true);
//     } catch (e) {
//       console.error('Retrain failed', e);
//     } finally {
//       setRetrainLoading(false);
//     }
//   };

//   // --- CHART RENDERERS ---
//   const renderChart = (data, color = 'blue') => {
//     if (!data) {
//       return (
//         <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-500">
//           {loading ? 'Loading...' : (error || 'No data')}
//         </div>
//       );
//     }
//     const max = Math.max(...data.prices);
//     const min = Math.min(...data.prices);
//     const range = max - min || 1;
//     return (
//       <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end space-x-2 overflow-x-auto">
//         {data.prices.map((price, index) => {
//           const height = ((price - min) / range) * 200 + 20;
//           return (
//             <div key={index} className="flex-1 flex flex-col items-center">
//               <div
//                 className={`bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
//                 style={{ height: `${height}px`, width: '100%' }}
//               ></div>
//               <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
//                 {data.dates[index]}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const renderLineChart = (data, color = 'blue') => {
//     if (!data) {
//       return (
//         <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-500">
//           {predictionLoading ? 'Loading prediction...' : 'No prediction data'}
//         </div>
//       );
//     }
//     const max = Math.max(...data.prices);
//     const min = Math.min(...data.prices);
//     const range = max - min || 1;
//     return (
//       <svg className="w-full h-64 bg-gray-50 rounded-lg p-4" viewBox="0 0 500 250" preserveAspectRatio="none">
//         <polyline
//           fill="none"
//           stroke={color}
//           strokeWidth="2"
//           points={data.prices.map((price, i) => {
//             const x = (i / (data.prices.length - 1)) * 500;
//             const y = 250 - ((price - min) / range) * 200 - 25;
//             return `${x},${y}`;
//           }).join(" ")}
//         />
//       </svg>
//     );
//   };

//   const getCurrentPrice = () => {
//     if (!historical || historical.prices.length === 0) return 0;
//     return historical.prices[historical.prices.length - 1].toFixed(2);
//   };

//   const getChange = () => {
//     if (!historical || historical.prices.length < 2) return 0;
//     const p = historical.prices;
//     return (p[p.length - 1] - p[p.length - 2]).toFixed(2);
//   };

//   const change = parseFloat(getChange());

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Charts & Analysis</h1>
//         <p className="text-gray-600">Analyze stock trends and predictions</p>
//       </div>

//       {/* Stock Search */}
//       <div className="card p-6 mb-8 bg-white shadow rounded-lg">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Stock</h2>
//         <div className="mb-4">
//           <input
//             type="text"
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
//             placeholder="Enter stock symbol (e.g. AAPL, TSLA, MSFT)"
//             value={search}
//             onChange={e => setSearch(e.target.value.toUpperCase())}
//             onKeyDown={e => {
//               if (e.key === 'Enter' && search) {
//                 setSelectedStock(search);
//               }
//             }}
//           />
//           <button
//             className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
//             disabled={!search}
//             onClick={() => setSelectedStock(search)}
//           >
//             Analyze
//           </button>
//         </div>
//         {selectedStock && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">{selectedStock}</h3>
//                 <div className="text-3xl font-bold text-gray-900">${getCurrentPrice()}</div>
//               </div>
//               <div className="text-right">
//                 <div className={`text-lg font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Tabs */}
//       <div className="card mb-8 bg-white shadow rounded-lg">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8 px-6">
//             <button
//               onClick={() => setActiveTab('historical')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'historical'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Historical Data
//             </button>
//             <button
//               onClick={() => setActiveTab('prediction')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'prediction'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Price Prediction
//             </button>
//           </nav>
//         </div>
//         <div className="p-6">
//           {activeTab === 'historical' ? (
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 {selectedStock} - Historical Closing Prices
//               </h3>
//               {renderChart(historical)}
//               <div className="mt-4 text-sm text-gray-600">* Historical data fetched via Yahoo Finance</div>
//             </div>
//           ) : (
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 {selectedStock ? `${selectedStock} - Price Prediction` : 'Price Prediction'}
//               </h3>
//               {selectedStock ? (
//                 <>
//                   {predictionLoading ? (
//                     <div className="h-64 flex items-center justify-center text-gray-500">Loading prediction...</div>
//                   ) : prediction && prediction.dates ? (
//                     renderLineChart(prediction, 'blue')
//                   ) : (
//                     <button
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
//                       onClick={loadPrediction}
//                     >
//                       Load Prediction
//                     </button>
//                   )}
//                   {modelExists && (
//                     <button
//                       className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium"
//                       onClick={handleRetrain}
//                       disabled={retrainLoading}
//                     >
//                       {retrainLoading ? 'Retraining...' : 'Retrain Model'}
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <div className="h-64 flex items-center justify-center text-gray-500">
//                   Enter a stock symbol above and click Analyze to view predictions.
//                 </div>
//               )}
//               <div className="mt-4 text-sm text-gray-600">
//                 * Predictions powered by LSTM deep learning model and Yahoo Finance data
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Charts;




import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../lib/api';
import Plot from "react-plotly.js";

const Charts = () => {
  const [selectedStock, setSelectedStock] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('historical');
  const [historical, setHistorical] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [modelExists, setModelExists] = useState(false);
  const [retrainLoading, setRetrainLoading] = useState(false);


  // fetch historical candlestick chart
  useEffect(() => {
    const load = async () => {
      if (!selectedStock) {
        setHistorical(null);
        setError('');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await apiGet(`/api/predictor/historical/?symbol=${encodeURIComponent(selectedStock)}`);
        if (Array.isArray(res) && res.length > 0) {
          setHistorical(res);
        } else {
          setError('No historical data found.');
          setHistorical(null);
        }
      } catch (e) {
        setError('Failed to load historical data');
        setHistorical(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedStock]);


  // --- CHART RENDERERS ---
  const renderHistoricalChart = (data) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-500">
          {loading ? 'Loading...' : (error || 'No data')}
        </div>
      );
    }

    return (
      <Plot
        data={[
          {
            x: data.map(row => row.Date),
            open: data.map(row => row.Open),
            high: data.map(row => row.High),
            low: data.map(row => row.Low),
            close: data.map(row => row.Close),
            type: "candlestick",
            increasing: { line: { color: "green" } },
            decreasing: { line: { color: "red" } },
          },
        ]}
        layout={{
          width: 1135,
          // autosize: true,
          height: 700,
          title: `${selectedStock} - Last 2 months`,
          xaxis: { title: "Date", rangeslider: { visible: false }, },
          yaxis: { title: "Price" },
          plot_bgcolor: "white",
        }}
      />
    );
  };


  // Reset prediction state when stock changes
  useEffect(() => {
    if (selectedStock) {
      console.log("🔄 Stock changed, resetting prediction state for:", selectedStock);
      setPrediction(null);        // clear old prediction
      setModelExists(false);      // clear model existence until checked
    }
  }, [selectedStock]);


  // check model existence
  useEffect(() => {
    const checkModel = async () => {
      if (!selectedStock) return;
      try {
        console.log('📦 [ModelExists] Checking for:', selectedStock);
        const data = await apiGet(`/api/predictor/exists/?symbol=${selectedStock}`);
        console.log('✅ [ModelExists] Response:', data);
        setModelExists(!!data?.exists);
      } catch (e) {
        console.error('❌ [ModelExists] Error:', e);
        setModelExists(false);
      }
    };
    checkModel();
  }, [selectedStock]);


  const loadPrediction = async () => {
    if (!selectedStock) return;
    setPredictionLoading(true);
    setPrediction(null); // reset old prediction before fetching new
    try {
      const data = await apiGet(`/api/predictor/predict/?symbol=${selectedStock}&days=7`);
      console.log('✅ [Prediction API data]:', data);

      if (data && data.date && data.predicted_close) {
        setPrediction(data);  // <-- save raw dict
      } else {
        setPrediction(null);
      }
    } catch (e) {
      console.error('❌ [Prediction Fetch Error]:', e);
      setPrediction(null);
    } finally {
      setPredictionLoading(false);
    }
  };




  // retrain model
  const handleRetrain = async () => {
    setRetrainLoading(true);
    console.log('🛠️ [Retrain] Starting retrain for:', selectedStock);
    try {
      await apiPost(`/api/predictor/retrain/`, { symbol: selectedStock });
      console.log('✅ [Retrain] Completed. Reloading prediction...');
      await loadPrediction();
      setModelExists(true);
    } catch (e) {
      console.error('❌ [Retrain] Retrain failed:', e);
    } finally {
      setRetrainLoading(false);
    }
  };


  const renderBarChart = (data) => {
    if (!data || !data.date || !data.predicted_close) {
      return (
        <div className="h-full w-full flex items-center justify-center text-gray-500">
          {predictionLoading ? 'Loading prediction...' : 'No prediction data'}
        </div>
      );
    }

    const prices = data.predicted_close;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const buffer = (maxPrice - minPrice) * 0.3 || 1; // add 10% padding, fallback=1

    return (
      <Plot
        data={[
          {
            x: data.date,
            y: data.predicted_close,

            type: "bar",
            name: "Predicted Close",
            marker: { color: "rgb(37, 99, 235)" }, // Tailwind blue-600
          },
          {
            x: data.date,
            y: Array(data.date.length).fill(getCurrentPrice()), // baseline from historical
            type: "scatter",
            mode: "lines",
            name: "Last Close",
            line: { color: "red", dash: "dot" },
          },
        ]}
        layout={{
          autosize: true,
          height: 500,
          title: `${selectedStock} - Next 7 Days Predicted Closing Prices`,
          xaxis: { title: "Date" },
          yaxis: {
            title: "Price",
            range: [minPrice - buffer, maxPrice + buffer],
          },
          plot_bgcolor: "white",
          legend: { orientation: "h", y: -0.2 }, // horizontal legend under chart
        }}
        style={{ width: "100%" }}
        useResizeHandler={true}
      />
    );
  };




  const getCurrentPrice = () => {
    if (!historical || historical.length === 0) return 0;
    return historical[historical.length - 1].Close.toFixed(2);
  };

  const getChange = () => {
    if (!historical || historical.length < 2) return 0;
    const p = historical;
    return (p[p.length - 1].Close - p[p.length - 2].Close).toFixed(2);
  };

  const change = parseFloat(getChange());

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Charts & Analysis</h1>
                  <p className="text-white/90 text-lg">Analyze stock trends and predictions with advanced analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Candlestick charts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">LSTM predictions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Technical analysis</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Search */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Select Stock for Analysis</h2>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter stock symbol (e.g. AAPL, TSLA, MSFT)"
            value={search}
            onChange={e => {
              const v = e.target.value.toUpperCase();
              console.log('⌨️ [Search] value:', v);
              setSearch(v);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && search) {
                console.log('🔍 [Analyze] via Enter key for:', search);
                setSelectedStock(search);
              }
            }}
          />
          <button
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            disabled={!search}
            onClick={() => {
              console.log('🔍 [Analyze] button for:', search);
              setSelectedStock(search);
            }}
          >
            Analyze
          </button>
        </div>
        {selectedStock && (
          <div className="mt-4 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">{selectedStock}</h3>
                <div className="text-3xl font-bold text-neutral-900">${getCurrentPrice()}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical Data Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="text-lg font-semibold text-neutral-900">
            {selectedStock ? `${selectedStock} - Historical Data` : 'Historical Data'}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">Candlestick chart showing last 2 months of trading</p>
        </div>
        <div className="p-6">
          <div className="bg-neutral-50 rounded-lg p-4 flex items-center justify-center">
            {renderHistoricalChart(historical)}
          </div>
          <div className="mt-4 text-sm text-neutral-600 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Historical data fetched via Yahoo Finance</span>
          </div>
        </div>
      </div>

      {/* Price Prediction Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="text-lg font-semibold text-neutral-900">
            {selectedStock ? `${selectedStock} - Price Prediction` : 'Price Prediction'}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">LSTM model predictions for next 7 days</p>
        </div>
        <div className="p-6">
          <div className="bg-neutral-50 rounded-lg p-4 flex items-center justify-center mb-6">
            {predictionLoading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-neutral-600">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading prediction...
                </div>
              </div>
            ) : prediction && prediction.date ? (
              <div className="w-full">{renderBarChart(prediction)}</div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No prediction data yet</h3>
                <p className="text-neutral-600">Select a stock and load prediction to see forecast</p>
              </div>
            )}
          </div>

          {selectedStock && (
            <div className="flex flex-wrap gap-4">
              {!prediction && !predictionLoading && (
                <button
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                  onClick={loadPrediction}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Load Prediction</span>
                </button>
              )}
              {modelExists && (
                <button
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                  onClick={handleRetrain}
                  disabled={retrainLoading}
                >
                  {retrainLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Retraining...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Retrain Model</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {!selectedStock && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Ready to analyze?</h3>
              <p className="text-neutral-600">Enter a stock symbol above and click Analyze to view predictions</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-neutral-600 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Predictions powered by LSTM deep learning model and Yahoo Finance data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;