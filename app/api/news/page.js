"use client";
import { useState, useEffect } from "react";

const CATEGORIES = ["All", "AI Models", "Big Tech", "Startups", "Research", "Policy"];

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchNews = async (category = "All", query = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setArticles(data.articles);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError("Could not load news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews("All");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchNews(activeCategory, searchQuery);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchQuery("");
    fetchNews(cat);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050508; color: #e8e6f0; font-family: 'Syne', sans-serif; min-height: 100vh; }
        .app { min-height: 100vh; background: #050508; position: relative; overflow-x: hidden; }
        .app::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(120,80,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,80,255,0.04) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
        .app::after { content: ''; position: fixed; top: -20%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108,47,255,0.12) 0%, transparent 70%); pointer-events: none; z-index: 0; }
        .ticker-bar { background: #6c2fff; padding: 8px 0; overflow: hidden; position: relative; z-index: 10; }
        .ticker-track { display: flex; gap: 60px; animation: ticker 40s linear infinite; white-space: nowrap; }
        .ticker-item { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.9); flex-shrink: 0; }
        .ticker-item::before { content: '▸ '; color: rgba(255,255,255,0.5); }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        header { position: relative; z-index: 10; padding: 40px 48px 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .logo { font-family: 'Instrument Serif', serif; font-size: 42px; font-style: italic; color: #fff; line-height: 1; }
        .logo span { color: #6c2fff; font-style: normal; }
        .logo-sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.35); text-transform: uppercase; margin-top: 6px; }
        .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .search-form { display: flex; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.04); }
        .search-input { background: transparent; border: none; outline: none; color: #e8e6f0; font-family: 'Syne', sans-serif; font-size: 13px; padding: 10px 16px; width: 240px; }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .search-btn { background: #6c2fff; border: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; padding: 10px 16px; cursor: pointer; letter-spacing: 0.05em; }
        .search-btn:hover { background: #7d40ff; }
        .refresh-btn { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 6px 14px; border-radius: 4px; cursor: pointer; }
        .refresh-btn:hover { border-color: #6c2fff; color: #a07cff; }
        nav { position: relative; z-index: 10; padding: 28px 48px 0; display: flex; gap: 4px; flex-wrap: wrap; }
        .nav-btn { background: transparent; border: 1px solid transparent; color: rgba(255,255,255,0.4); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 7px 16px; border-radius: 4px; cursor: pointer; }
        .nav-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.1); }
        .nav-btn.active { background: rgba(108,47,255,0.2); border-color: rgba(108,47,255,0.5); color: #a07cff; }
        .status-bar { position: relative; z-index: 10; padding: 16px 48px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #00d68f; animation: pulse 2s infinite; }
        .dot.loading { background: #f0a500; }
        .dot.error { background: #ff4444; animation: none; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .status-text { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.35); }
        .count { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.25); }
        main { position: relative; z-index: 10; padding: 32px 48px 64px; display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
        .card { border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; background: rgba(255,255,255,0.03); cursor: pointer; transition: border-color 0.25s, background 0.25s, transform 0.2s; backdrop-filter: blur(10px); animation: fadeUp 0.5s both; }
        .card:hover { border-color: rgba(108,47,255,0.4); background: rgba(108,47,255,0.06); transform: translateY(-2px); }
        .card-inner { padding: 22px 24px; }
        .card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .card-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #6c2fff; background: rgba(108,47,255,0.15); padding: 3px 10px; border-radius: 3px; border: 1px solid rgba(108,47,255,0.3); }
        .card-time { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.25); }
        .card-title { font-family: 'Instrument Serif', serif; font-size: 19px; line-height: 1.35; color: #f0eeff; margin-bottom: 12px; }
        .card-summary { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.5); margin-bottom: 14px; }
        .card-detail { font-size: 12px; line-height: 1.7; color: rgba(255,255,255,0.35); margin-bottom: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); font-style: italic; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; }
        .card-source { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.25); }
        .card-expand { background: transparent; border: none; color: #6c2fff; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; }
        .card-expand:hover { color: #a07cff; }
        .skel { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; height: 12px; margin-bottom: 8px; }
        .skel-meta { display: flex; justify-content: space-between; margin-bottom: 14px; }
        .skel-tag { width: 70px; height: 20px; } .skel-time { width: 50px; height: 20px; }
        .skel-title { height: 18px; margin-bottom: 6px; } .skel-title.short { width: 60%; }
        .skel-body { height: 12px; } .skel-body.short { width: 75%; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .error-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.35); }
        .retry-btn { margin-top: 16px; background: #6c2fff; border: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 24px; border-radius: 6px; cursor: pointer; }
        @media (max-width: 640px) { header, nav, .status-bar, main { padding-left: 20px; padding-right: 20px; } .logo { font-size: 32px; } .search-input { width: 150px; } main { grid-template-columns: 1fr; } }
      `}</style>

      <div className="app">
        {articles.length > 0 && (
          <div className="ticker-bar">
            <div className="ticker-track">
              {[...articles, ...articles].map((a, i) => (
                <span key={i} className="ticker-item">{a.title}</span>
              ))}
            </div>
          </div>
        )}

        <header>
          <div>
            <div className="logo">Pulse<span>AI</span></div>
            <div className="logo-sub">AI & Tech Intelligence Feed</div>
          </div>
          <div className="header-right">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                className="search-input"
                type="text"
                placeholder="Search any topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn" type="submit">SEARCH</button>
            </form>
            <button className="refresh-btn" onClick={() => fetchNews(activeCategory)} disabled={loading}>
              {loading ? "FETCHING..." : "↺ REFRESH"}
            </button>
          </div>
        </header>

        <nav>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`nav-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="status-bar">
          <div className={`dot ${loading ? "loading" : error ? "error" : ""}`} />
          <span className="status-text">
            {loading ? "Fetching live articles..." : error ? "Connection error" : lastUpdated ? `Updated ${lastUpdated}` : "Ready"}
          </span>
          {!loading && !error && <span className="count">{articles.length} articles</span>}
        </div>

        <main>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="card-inner">
                  <div className="skel-meta"><div className="skel skel-tag" /><div className="skel skel-time" /></div>
                  <div className="skel skel-title" /><div className="skel skel-title short" />
                  <div className="skel skel-body" /><div className="skel skel-body" /><div className="skel skel-body short" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="retry-btn" onClick={() => fetchNews(activeCategory)}>Try Again</button>
            </div>
          ) : (
            articles.map((article, i) => (
              <div
                key={i}
                className="card"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              >
                <div className="card-inner">
                  <div className="card-meta">
                    <span className="card-tag">{article.category}</span>
                    <span className="card-time">{article.time}</span>
                  </div>
                  <h3 className="card-title">{article.title}</h3>
                  <p className="card-summary">{article.summary}</p>
                  {expandedIndex === i && <p className="card-detail">{article.detail}</p>}
                  <div className="card-footer">
                    <span className="card-source">↗ {article.source}</span>
                    <button className="card-expand">{expandedIndex === i ? "Less ↑" : "More ↓"}</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}
