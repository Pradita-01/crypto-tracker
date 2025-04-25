// src/services/websocketService.js

let socket = null;

export const connectWebSocket = (onMessage) => {
  // You can modify the assets list here as needed
  socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin');

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data); // Call your handler with the price data
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket disconnected");
  };
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
