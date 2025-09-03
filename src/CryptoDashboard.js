// src/CryptoDashboard.js
import React, { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// --- Mini AI Insights helpers ---
const isConsistentUpward = (coin) => {
  const prices = coin.sparkline_in_7d.price;
  let upCount = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) upCount++; 
  }
  return upCount / (prices.length - 1) > 0.7; // >70% increasing
};

const isPotentialBreakout = (coin) => {
  return coin.total_volume / coin.market_cap > 0.05; // high volume relative to market cap
};

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "market_cap", direction: "desc" });
  const [portfolio, setPortfolio] = useState({});
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Fetch top 100 coins
  const fetchCoins = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      const data = await res.json();
      setCoins(data);
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching coins:", err);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sorting
  const sortCoins = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
    setCoins((prevCoins) =>
      [...prevCoins].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  // Portfolio input
  const handlePortfolioChange = (coinId, amount) => {
    setPortfolio((prev) => ({ ...prev, [coinId]: parseFloat(amount) || 0 }));
  };

  // Favorite toggle
  const toggleFavorite = (coinId) => {
    let updated = [];
    if (favorites.includes(coinId)) {
      updated = favorites.filter((id) => id !== coinId);
    } else {
      updated = [...favorites, coinId];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Filter coins
  let filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (showFavorites) filteredCoins = filteredCoins.filter((coin) => favorites.includes(coin.id));

  // Top Gainers / Losers
  const topGainers = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5);
  const topLosers = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5);

  // Total portfolio value
  const totalValue = coins.reduce((acc, coin) => acc + (portfolio[coin.id] || 0) * coin.current_price, 0);

  if (loading) return <h2 style={{ color: "white", textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ background: "#2a0d4d", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "white", marginBottom: "10px" }}>Crypto Tracker</h1>
      <p style={{ textAlign: "center", color: "lightgray", marginBottom: "10px" }}>
        Last updated: {lastUpdated || "Loading..."} | Showing {filteredCoins.length} coins
      </p>

      {/* Portfolio Value */}
      <p style={{ textAlign: "center", color: "lightgreen", marginBottom: "20px", fontWeight: "bold" }}>
        Total Portfolio Value: ${totalValue.toLocaleString()}
      </p>

      {/* Search & Favorites */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "5px", width: "250px", marginRight: "10px" }}
        />
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          style={{ padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
        >
          {showFavorites ? "Show All Coins" : "Show Favorites ⭐"}
        </button>
      </div>

      {/* Top Gainers / Losers */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <div style={{ color: "green" }}>
          <h3>Top Gainers (24h)</h3>
          <ul>
            {topGainers.map((coin) => (
              <li key={coin.id}>{coin.symbol.toUpperCase()}: {coin.price_change_percentage_24h.toFixed(2)}%</li>
            ))}
          </ul>
        </div>
        <div style={{ color: "red" }}>
          <h3>Top Losers (24h)</h3>
          <ul>
            {topLosers.map((coin) => (
              <li key={coin.id}>{coin.symbol.toUpperCase()}: {coin.price_change_percentage_24h.toFixed(2)}%</li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Mini AI Insights Icon & Modal --- */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
        <span
          style={{
            cursor: "pointer",
            fontSize: "30px",
            background: "#5e17eb",
            padding: "10px",
            borderRadius: "50%",
            color: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}
          onClick={() => setShowAIInsights(true)}
          title="Click to view AI Insights"
        >
          🤖
        </span>
      </div>

      {showAIInsights && (
        <div
          onClick={() => setShowAIInsights(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#2a0d4d",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 0 15px rgba(0,0,0,0.5)"
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "15px", color: "#ffcc00" }}>Mini AI Insights 🤖</h2>
            
            <div style={{ marginBottom: "10px" }}>
              <h4 style={{ color: "lightgreen" }}>Consistent 7-day Upward Trend:</h4>
              <p>{coins.filter(isConsistentUpward).map(c => c.symbol.toUpperCase()).join(", ") || "None"}</p>
            </div>
            
            <div>
              <h4 style={{ color: "orange" }}>Potential Breakout Coins:</h4>
              <p>{coins.filter(isPotentialBreakout).map(c => c.symbol.toUpperCase()).join(", ") || "None"}</p>
            </div>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                onClick={() => setShowAIInsights(false)}
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  background: "#ffcc00",
                  color: "#2a0d4d",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "none"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coins Table */}
      <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "10px", overflow: "hidden" }}>
          <thead style={{ background: "#5e17eb", color: "white" }}>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Coin</th>
              <th style={thStyle} onClick={() => sortCoins("current_price")}>Price</th>
              <th style={thStyle} onClick={() => sortCoins("price_change_percentage_1h_in_currency")}>1h</th>
              <th style={thStyle} onClick={() => sortCoins("price_change_percentage_24h_in_currency")}>24h</th>
              <th style={thStyle} onClick={() => sortCoins("price_change_percentage_7d_in_currency")}>7d</th>
              <th style={thStyle} onClick={() => sortCoins("total_volume")}>24h Volume</th>
              <th style={thStyle} onClick={() => sortCoins("market_cap")}>Market Cap</th>
              <th style={thStyle}>Portfolio</th>
              <th style={thStyle}>Last 7d</th>
              <th style={thStyle}>⭐</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin, index) => (
              <tr key={coin.id} style={{ textAlign: "center" }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={{ ...tdStyle, display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src={coin.image} alt={coin.name} style={{ width: "20px", height: "20px" }} />
                  <span>{coin.name}</span>
                  <span style={{ color: "gray", textTransform: "uppercase" }}>{coin.symbol}</span>
                </td>
                <td style={tdStyle}>${coin.current_price?.toLocaleString()}</td>
                <td style={{ ...tdStyle, color: getColor(coin.price_change_percentage_1h_in_currency) }}>
                  {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                </td>
                <td style={{ ...tdStyle, color: getColor(coin.price_change_percentage_24h_in_currency) }}>
                  {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                </td>
                <td style={{ ...tdStyle, color: getColor(coin.price_change_percentage_7d_in_currency) }}>
                  {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </td>
                <td style={tdStyle}>${coin.total_volume?.toLocaleString()}</td>
                <td style={tdStyle}>${coin.market_cap?.toLocaleString()}</td>

                {/* Portfolio input */}
                <td style={tdStyle}>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={portfolio[coin.id] || ""}
                    onChange={(e) => handlePortfolioChange(coin.id, e.target.value)}
                    style={{ width: "60px", textAlign: "center" }}
                  />
                  {portfolio[coin.id] ? (
                    <div style={{ fontSize: "12px", color: "black" }}>
                      ${(portfolio[coin.id] * coin.current_price).toLocaleString()}
                    </div>
                  ) : null}
                </td>

                <td style={{ width: "120px", height: "50px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coin.sparkline_in_7d.price.map((p, i) => ({ price: p, index: i }))}>
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={coin.price_change_percentage_7d_in_currency >= 0 ? "green" : "red"}
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </td>

                {/* Favorite ⭐ */}
                <td style={tdStyle}>
                  <span
                    style={{ cursor: "pointer", color: favorites.includes(coin.id) ? "gold" : "gray", fontSize: "20px" }}
                    onClick={() => toggleFavorite(coin.id)}
                  >
                    ⭐
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Table styles
const thStyle = {
  padding: "12px",
  textAlign: "center",
  fontSize: "14px",
  cursor: "pointer",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  fontSize: "13px",
};

// Color helper
const getColor = (value) => {
  if (value > 0) return "green";
  if (value < 0) return "red";
  return "black";
};

export default CryptoDashboard;
