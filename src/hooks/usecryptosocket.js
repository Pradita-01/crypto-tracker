// src/hooks/useCryptoSocket.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCrypto } from '../features/cryptoslice';

const useCryptoSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const symbols = ['btcusdt', 'ethusdt', 'usdtusdt', 'bnbusdt', 'xrpusdt', 'adausdt', 'solusdt'];
    const streamString = symbols.map(s => `${s}@ticker`).join('/');
    const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamString}`);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const ticker = msg.data;

      dispatch(updateCrypto({
        symbol: ticker.s,                       // e.g. BTCUSDT
        price: parseFloat(ticker.c),            // current price
        change: parseFloat(ticker.P),           // price change percent
        volume: parseFloat(ticker.v),           // 24h volume
      }));
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);
};

export default useCryptoSocket;
