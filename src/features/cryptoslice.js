import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    BTCUSDT: { price: 0, change: 0, volume: 0 },
    ETHUSDT: { price: 0, change: 0, volume: 0 },
    USDTUSDT: { price: 0, change: 0, volume: 0 },
    BNBUSDT: { price: 0, change: 0, volume: 0 },
    XRPUSDT: { price: 0, change: 0, volume: 0 },
    ADAUSDT: { price: 0, change: 0, volume: 0 },
    SOLUSDT: { price: 0, change: 0, volume: 0 },
  },
  assets: [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTCUSDT',
      price: 29000,
      percent1h: 0.5,
      percent24h: 1.2,
      percent7d: -3.4,
      marketCap: 570000000000,
      volume24h: 25000000000,
      circulatingSupply: 19000000,
      maxSupply: 21000000,
      logo: '/images/bitcoin.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETHUSDT',
      price: 1800,
      percent1h: -0.3,
      percent24h: 2.1,
      percent7d: 5.7,
      marketCap: 210000000000,
      volume24h: 15000000000,
      circulatingSupply: 120000000,
      maxSupply: null,
      logo: '/images/etherum.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDTUSDT',
      price: 1.00,
      percent1h: 0.0,
      percent24h: 0.01,
      percent7d: 0.0,
      marketCap: 83000000000,
      volume24h: 30000000000,
      circulatingSupply: 83000000000,
      maxSupply: null,
      logo: '/images/tether.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNBUSDT',
      price: 230,
      percent1h: 0.2,
      percent24h: 0.5,
      percent7d: -2.2,
      marketCap: 36000000000,
      volume24h: 800000000,
      circulatingSupply: 153000000,
      maxSupply: 200000000,
      logo: '/images/bnb.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
    {
      id: 'xrp',
      name: 'Ripple',
      symbol: 'XRPUSDT',
      price: 0.62,
      percent1h: -0.1,
      percent24h: 1.9,
      percent7d: -1.8,
      marketCap: 26000000000,
      volume24h: 900000000,
      circulatingSupply: 42000000000,
      maxSupply: 100000000000,
      logo: '/images/ripple.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
    {
      id: 'ada',
      name: 'Cardano',
      symbol: 'ADAUSDT',
      price: 0.38,
      percent1h: 0.4,
      percent24h: 2.3,
      percent7d: 3.2,
      marketCap: 12000000000,
      volume24h: 400000000,
      circulatingSupply: 31000000000,
      maxSupply: 45000000000,
      logo: '/images/cardano.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOLUSDT',
      price: 22,
      percent1h: 0.8,
      percent24h: -0.9,
      percent7d: 4.1,
      marketCap: 9000000000,
      volume24h: 500000000,
      circulatingSupply: 400000000,
      maxSupply: null,
      logo: '/images/solana.png',
      chart7d: 'https://www.coinigy.com/images/chart_sample.svg',
    },
  ]
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCrypto(state, action) {
      const { symbol, price, change, volume } = action.payload;
      if (state.data[symbol]) {
        state.data[symbol] = { price, change, volume };
        // optionally update matching asset price too
        const asset = state.assets.find(a => a.symbol === symbol);
        if (asset) {
          asset.price = price;
        }
      }
    },
  },
});

export const { updateCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer;
