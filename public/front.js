import React, { useEffect, useState } from "react";

export default function CryptoTracker() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    )
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">💹 Crypto Tracker</h1>
      {loading ? (
        <p className="text-lg">Loading live prices...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="bg-gray-800 p-4 rounded-2xl shadow-lg flex items-center space-x-4 hover:scale-105 transform transition"
            >
              <img src={coin.image} alt={coin.name} className="w-12 h-12" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{coin.name}</h2>
                <p className="text-gray-400 uppercase">{coin.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${coin.current_price.toLocaleString()}</p>
                <p
                  className={`text-sm ${
                    coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
