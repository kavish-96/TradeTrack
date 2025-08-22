import React, { useEffect, useState } from "react";

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [loading, setLoading] = useState(true);

  const categories = ["General", "Forex", "Crypto", "Merger"];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/news/latest/?category=${selectedCategory.toLowerCase()}`
        );
        const data = await res.json();
        setNews(data.news || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchNews();
  }, [selectedCategory]);

  const getCategoryColor = (category) => {
    const colors = {
      General: "bg-blue-100 text-blue-800",
      Forex: "bg-purple-100 text-purple-800",
      Crypto: "bg-orange-100 text-orange-800",
      Merger: "bg-green-100 text-green-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4 animate-spin">📰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loading {selectedCategory} news...
        </h3>
      </div>
    );
  }

  const breakingNews = news.filter((article) => article.isBreaking);
  const regularNews = news.filter((article) => !article.isBreaking);

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Market News</h1>
                  <p className="text-white/90 text-lg">Stay updated with the latest financial and market news</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Breaking news alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Multiple categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm font-medium">Real-time updates</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-blue-800 font-semibold">Live News Feed</span>
          <span className="text-blue-600 text-sm">• Real-time updates</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-primary-600 text-white shadow-lg transform scale-105"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Breaking News Section */}
      {breakingNews.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600">Breaking News</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {breakingNews.map((article) => (
              <div
                key={article.id}
                className="bg-white border-l-4 border-red-500 rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 hover:text-red-600 cursor-pointer line-clamp-2">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.headline}
                  </a>
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-medium bg-red-50 text-red-700 px-2 py-1 rounded-full">{article.source}</span>
                  <span>{new Date(article.timestamp * 1000).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular News Section */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Latest {selectedCategory} News
          </h2>
        </div>
        
        <div className="space-y-6">
          {regularNews.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        article.category === 'General' ? 'bg-blue-100 text-blue-800' :
                        article.category === 'Forex' ? 'bg-purple-100 text-purple-800' :
                        article.category === 'Crypto' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {new Date(article.timestamp * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3 hover:text-primary-600 cursor-pointer line-clamp-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.headline}
                    </a>
                  </h3>
                  
                  <p className="text-neutral-600 mb-4 line-clamp-3">{article.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-700">{article.source}</span>
                    <span className="text-sm text-neutral-500">
                      {new Date(article.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                {article.image && (
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <img
                      src={article.image}
                      alt="news"
                      className="w-40 h-28 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {news.length === 0 && (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-lg">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No {selectedCategory} news found
          </h3>
          <p className="text-neutral-600">
            No articles available for this category at the moment
          </p>
        </div>
      )}
    </div>
  );
};

export default News;
