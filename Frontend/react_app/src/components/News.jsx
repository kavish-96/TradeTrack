import React, { useState } from 'react';

const News = () => {
  const [news] = useState([
    {
      id: 1,
      headline: "Apple Announces Record Q4 Earnings Beat",
      source: "MarketWatch",
      timestamp: "2 hours ago",
      summary: "Apple Inc. reported quarterly earnings that exceeded analyst expectations, driven by strong iPhone sales...",
      category: "Earnings",
      isBreaking: true
    },
    {
      id: 2,
      headline: "Tesla Expands Supercharger Network to 50,000 Stations",
      source: "Reuters",
      timestamp: "4 hours ago",
      summary: "Tesla has reached a milestone of 50,000 Supercharger stations worldwide, marking significant progress...",
      category: "Technology",
      isBreaking: false
    },
    {
      id: 3,
      headline: "Federal Reserve Hints at Interest Rate Changes",
      source: "Financial Times",
      timestamp: "6 hours ago",
      summary: "Fed officials suggest potential policy adjustments in response to recent economic indicators...",
      category: "Economic Policy",
      isBreaking: true
    },
    {
      id: 4,
      headline: "Google's AI Revenue Surges 42% Year-over-Year",
      source: "CNBC",
      timestamp: "8 hours ago",
      summary: "Alphabet's AI division shows remarkable growth as enterprise adoption accelerates across industries...",
      category: "Technology",
      isBreaking: false
    },
    {
      id: 5,
      headline: "Oil Prices Stabilize After Weekly Volatility",
      source: "Bloomberg",
      timestamp: "10 hours ago",
      summary: "Crude oil futures find support after a week of significant price swings driven by geopolitical concerns...",
      category: "Commodities",
      isBreaking: false
    },
    {
      id: 6,
      headline: "Microsoft Azure Growth Continues to Outpace AWS",
      source: "TechCrunch",
      timestamp: "12 hours ago",
      summary: "Microsoft's cloud computing division shows strong quarterly growth, gaining market share against competitors...",
      category: "Technology",
      isBreaking: false
    },
    {
      id: 7,
      headline: "Cryptocurrency Market Shows Mixed Signals",
      source: "CoinDesk",
      timestamp: "14 hours ago",
      summary: "Bitcoin and major altcoins display varied performance as institutional adoption continues to evolve...",
      category: "Crypto",
      isBreaking: false
    },
    {
      id: 8,
      headline: "Renewable Energy Stocks Surge on Climate Policy News",
      source: "Green Finance",
      timestamp: "16 hours ago",
      summary: "Clean energy companies see significant gains following new government climate initiatives...",
      category: "Environment",
      isBreaking: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Earnings', 'Technology', 'Economic Policy', 'Commodities', 'Crypto', 'Environment'];

  const filteredNews = news.filter(article => 
    selectedCategory === 'All' || article.category === selectedCategory
  );

  const getCategoryColor = (category) => {
    const colors = {
      'Earnings': 'bg-success-100 text-success-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Economic Policy': 'bg-purple-100 text-purple-800',
      'Commodities': 'bg-yellow-100 text-yellow-800',
      'Crypto': 'bg-orange-100 text-orange-800',
      'Environment': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market News</h1>
        <p className="text-gray-600">Stay updated with the latest financial and market news</p>
      </div>

      {/* Live Status */}
      <div className="card p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-blue-800 font-semibold">News Feed</span>
          {/* <span className="text-blue-600 text-sm">• Updates every 5 minutes</span> */}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Breaking News Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Breaking News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.filter(article => article.isBreaking).slice(0, 2).map((article) => (
            <div key={article.id} className="card p-6 border-red-200 bg-red-50">
              <div className="flex items-start space-x-2 mb-3">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BREAKING
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{article.headline}</h3>
              <p className="text-sm text-gray-600 mb-4">{article.summary}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.source}</span>
                <span>{article.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regular News */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Latest News</h2>
        <div className="space-y-4">
          {filteredNews.filter(article => !article.isBreaking).map((article) => (
            <div key={article.id} className="card p-6 hover:shadow-md transition duration-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                    {article.headline}
                  </h3>
                  <p className="text-gray-600 mb-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">{article.source}</span>
                    <span>{article.timestamp}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="btn-primary text-sm">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Integration Notice */}
      {/* <div className="card p-6 mt-8 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Real-time News Integration</h3>
        <p className="text-blue-800 mb-4">
          This news feed is ready for integration with real-time news APIs like NewsAPI, 
          Alpha Vantage, or financial news providers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Available Features:</h4>
            <ul className="space-y-1">
              <li>• Real-time news updates</li>
              <li>• Category-based filtering</li>
              <li>• Source credibility ratings</li>
              <li>• Sentiment analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Integration Options:</h4>
            <ul className="space-y-1">
              <li>• WebSocket real-time updates</li>
              <li>• Customizable refresh intervals</li>
              <li>• Push notifications</li>
              <li>• Personalized news feeds</li>
            </ul>
          </div>
        </div>
      </div> */}

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
          <p className="text-gray-600">No news articles match your selected category</p>
        </div>
      )}
    </div>
  );
};

export default News;