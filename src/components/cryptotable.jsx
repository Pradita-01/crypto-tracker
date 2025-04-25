import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { connectWebSocket, disconnectWebSocket } from '../services/websocketservices';

import './cryptotable.css';

// Format with arrow + color coding (always green or red)
const formatChange = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return <span style={{ color: 'gray' }}>—</span>; // This case will still handle invalid values

  const arrow = num > 0 ? '▲' : num < 0 ? '▼' : ''; // For zero change, we display the arrow
  const color = num === 0 ? 'green' : num > 0 ? 'green' : 'red'; // Always green for no change (can set red if preferred)

  return <span style={{ color, fontWeight: 'bold' }}>{arrow} {Math.abs(num).toFixed(2)}%</span>;
};

// Format price with color coding (always green or red)
const formatPrice = (price, previousPrice) => {
  const num = parseFloat(price);
  const prev = parseFloat(previousPrice);

  if (isNaN(num)) return <span style={{ color: 'gray' }}>—</span>; // This case will still handle invalid values

  // Check if price has increased, decreased, or stayed the same
  const color = num === prev ? 'green' : num > prev ? 'green' : 'red'; // Default to green if no change

  return <span style={{ color, fontWeight: 'bold' }}>${num.toFixed(2)}</span>;
};

// Generate random percentage change values
const getRandomPercentageChange = () => {
  return (Math.random() * 10 - 5).toFixed(2); // Random value between -5% and +5%
};

const CryptoTable = () => {
  const assets = useSelector((state) => state.crypto.assets);
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    if (!assets || !Array.isArray(assets)) return;

    connectWebSocket((priceData) => {
      setLivePrices((prev) => ({ ...prev, ...priceData }));
    });

    return () => {
      disconnectWebSocket();
    };
  }, [assets]);

  if (!assets || !Array.isArray(assets)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="crypto-table-container">
      <h2>Cryptocurrency Market (Live)</h2>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price (Live)</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>Volume 24h</th>
            <th>Chart</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((coin) => {
            const symbolKey = coin.symbol.toLowerCase();
            const idKey = coin.id?.toLowerCase();

            const logoUrl = `/images1/${symbolKey}.png`;
            const chartUrl = `/charts/${symbolKey}.png`;
            const volume =
              coin.volume ?? coin.volume24h ?? coin.total_volume ?? null;

            const livePrice = livePrices[idKey];
            const displayPrice = livePrice
              ? parseFloat(livePrice).toFixed(2)
              : coin.price?.toFixed(2) ?? 'N/A';

            // Using random values for percentage changes
            const percent1h = getRandomPercentageChange();
            const percent24h = getRandomPercentageChange();
            const percent7d = getRandomPercentageChange();

            return (
              <tr key={coin.symbol}>
                <td className="name-cells">
                  <img
                    src={logoUrl}
                    alt={coin.symbol}
                    className="coinLogos"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
                    }}
                  />
                  {coin.name || coin.symbol.replace('USDT', '')}
                </td>
                <td>{coin.symbol}</td>
                <td className="live-price">
                  {formatPrice(displayPrice, coin.price)}
                </td>
                <td>{formatChange(percent1h)}</td>
                <td>{formatChange(percent24h)}</td>
                <td>{formatChange(percent7d)}</td>
                <td>${coin.marketCap?.toLocaleString()}</td>
                <td>{volume ? `$${Number(volume).toLocaleString()}` : 'N/A'}</td>
                <td>
                  <img
                    src={chartUrl}
                    alt={`${coin.symbol} chart`}
                    className="chart-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
