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

  // fetch historical data
  useEffect(() => {
    const load = async () => {
      if (!selectedStock) return;
      setLoading(true);
      setError('');
      console.log('📡 [Historical] Fetching for:', selectedStock);
      try {
        const data = await apiGet(`/api/predictor/historical/?symbol=${encodeURIComponent(selectedStock)}`);
        console.log('✅ [Historical] Raw API data:', data);
        if (Array.isArray(data) && data.length > 0) {
          const formatted = {
            dates: data.map(item => item.date),
            prices: data.map(item => Number(item.close_price)),
          };
          console.log('🔄 [Historical] Formatted:', formatted);
          setHistorical(formatted);
        } else {
          console.warn('⚠️ [Historical] No data array or empty.');
          setError('No historical data found.');
          setHistorical(null);
        }
      } catch (e) {
        console.error('❌ [Historical] Failed to load historical data:', e);
        setError('Failed to load historical data');
        setHistorical(null);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedStock) {
      setHistorical(null);
      setPrediction(null);
      setError('');
      return;
    }
    load();
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

  // fetch prediction
  const loadPrediction = async () => {
    if (!selectedStock) {
      console.warn('⚠️ [Prediction] No selectedStock set; aborting.');
      return;
    }
    setPredictionLoading(true);
    console.log(`📡 [Prediction] Fetching for ${selectedStock}...`);
    try {
      const data = await apiGet(`/api/predictor/predict/?symbol=${selectedStock}&days=7`);
      console.log('✅ [Prediction] Raw API data:', data);

      if (Array.isArray(data) && data.length > 0) {
        const formatted = {
          dates: data.map(item => item?.date),
          prices: data.map(item => Number(item?.predicted_close)),
        };
        console.log('🔄 [Prediction] Formatted for chart:', formatted);

        // sanity checks
        const hasNaN = formatted.prices.some(p => !Number.isFinite(p));
        if (hasNaN) {
          console.warn('⚠️ [Prediction] Found non-finite values in prices:', formatted.prices);
        }
        setPrediction(formatted);
      } else {
        console.warn('⚠️ [Prediction] Empty/invalid array from API.');
        setPrediction(null);
      }
    } catch (e) {
      console.error('❌ [Prediction] Fetch failed:', e);
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

  // --- CHART RENDERERS ---
  const renderChart = (data, color = 'blue') => {
    if (!data) {
      return (
        <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-gray-500">
          {loading ? 'Loading...' : (error || 'No data')}
        </div>
      );
    }
    const max = Math.max(...data.prices);
    const min = Math.min(...data.prices);
    const range = max - min || 1;
    return (
      <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end space-x-2 overflow-x-auto">
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

  // SAFE line chart for predictions
  const renderLineChart = (data, color = 'blue') => {
    console.log('🎨 [Chart] Render line chart called with:', data);

    if (!data || !Array.isArray(data.prices) || data.prices.length === 0) {
      console.warn('⚠️ [Chart] No prediction data to render.');
      return (
        <div className="h-full w-full flex items-center justify-center text-gray-500">
          {predictionLoading ? 'Loading prediction...' : 'No prediction data'}
        </div>
      );
    }

    const cleanPrices = data.prices
      .map(p => Number(p))
      .filter(p => Number.isFinite(p));

    if (cleanPrices.length === 0) {
      console.warn('⚠️ [Chart] All prices were non-finite. Aborting render.');
      return (
        <div className="h-full w-full flex items-center justify-center text-gray-500">
          No prediction data
        </div>
      );
    }

    const max = Math.max(...cleanPrices);
    const min = Math.min(...cleanPrices);
    const range = max - min || 1;

    const n = cleanPrices.length;
    const width = 500;
    const height = 250;
    const xDen = Math.max(1, n - 1);
    const points = cleanPrices.map((price, i) => {
      const x = (i / xDen) * width;
      const y = height - ((price - min) / range) * 200 - 25;
      return `${x},${y}`;
    }).join(' ');

    console.log('📐 [Chart] SVG points:', points);

    const singlePoint = n === 1;
    const [singleX, singleY] = singlePoint ? points.split(',').map(Number) : [];

    return (
      <svg className="w-full h-full" viewBox="0 0 500 250" preserveAspectRatio="none">
        {!singlePoint ? (
          <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        ) : (
          <circle cx={singleX || 250} cy={singleY || 125} r="3" fill={color} />
        )}
      </svg>
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

      {/* Stock Search */}
      <div className="card p-6 mb-8 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Stock</h2>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
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
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
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
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedStock}</h3>
                <div className="text-3xl font-bold text-gray-900">${getCurrentPrice()}</div>
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

      {/* Tabs */}
      <div className="card mb-8 bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('historical')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'historical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historical Data
            </button>
            <button
              onClick={() => setActiveTab('prediction')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prediction'
                  ? 'border-blue-500 text-blue-600'
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
              {renderChart(historical)}
              <div className="mt-4 text-sm text-gray-600">* Historical data fetched via Yahoo Finance</div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStock ? `${selectedStock} - Price Prediction` : 'Price Prediction'}
              </h3>

              {/* Chart container always present */}
              <div className="h-64 bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                {predictionLoading ? (
                  <div className="text-gray-500">Loading prediction...</div>
                ) : prediction && prediction.dates ? (
                  renderLineChart(prediction, 'blue')
                ) : (
                  <div className="text-gray-400">No data yet</div>
                )}
              </div>

              {selectedStock && (
                <>
                  {!prediction && !predictionLoading && (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                      onClick={() => {
                        console.log('▶️ [UI] Load Prediction clicked');
                        loadPrediction();
                      }}
                    >
                      Load Prediction
                    </button>
                  )}
                  {modelExists && (
                    <button
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium"
                      onClick={handleRetrain}
                      disabled={retrainLoading}
                    >
                      {retrainLoading ? 'Retraining...' : 'Retrain Model'}
                    </button>
                  )}
                </>
              )}

              {!selectedStock && (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Enter a stock symbol above and click Analyze to view predictions.
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600">
                * Predictions powered by LSTM deep learning model and Yahoo Finance data
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;