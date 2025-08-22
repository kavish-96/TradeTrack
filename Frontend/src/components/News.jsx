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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market News</h1>
        <p className="text-gray-600">
          Stay updated with the latest financial and market news
        </p>
      </div>

      {/* Live Status */}
      <div className="card p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-blue-800 font-semibold">News Feed</span>
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
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          <h2 className="text-xl font-bold text-red-600 mb-4">🚨 Breaking News</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {breakingNews.map((article) => (
              <div
                key={article.id}
                className="card p-4 bg-red-50 border-l-4 border-red-500 hover:shadow-md transition duration-200"
              >
                <h3 className="text-md font-semibold text-gray-900 mb-2 hover:text-red-600 cursor-pointer">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.headline}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {article.summary.length > 120
                    ? article.summary.slice(0, 120) + "..."
                    : article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{article.source}</span>
                  <span>{new Date(article.timestamp * 1000).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular News Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Latest {selectedCategory} News
        </h2>
        <div className="space-y-4">
          {regularNews.map((article) => (
            <div
              key={article.id}
              className="card p-6 hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.headline}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">{article.source}</span>
                    <span>
                      {new Date(article.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
                {article.image && (
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <img
                      src={article.image}
                      alt="news"
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {news.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {selectedCategory} news found
          </h3>
          <p className="text-gray-600">
            No articles available for this category
          </p>
        </div>
      )}
    </div>
  );
};

export default News;
