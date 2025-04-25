Overview
The project is a live cryptocurrency price tracker that retrieves real-time prices for different cryptocurrencies. It shows different information including current price, change in the last 1 hour, 24 hours, and 7 days, market capitalization, and trading volume. The information is refreshed in real-time through the use of WebSocket technology to ensure the display reflects the latest trends in the market.

Features
Live Cryptocurrency Prices: Retrieves and displays live prices for different cryptocurrencies.

Percentage Change: Displays percentage changes for 1 hour, 24 hours, and 7 days with color coding.

Market Data: Displays market cap and trading volume for every cryptocurrency.

Charts: Shows a link to every cryptocurrency's chart image.

Error Handling: Handles missing data (e.g., logos or price data) gracefully by displaying placeholder images or "N/A".

Real-Time Updates: Updates data in real-time via WebSocket connection.

Responsive Layout: Designed for desktop and mobile web.

Tech Stack
React: For developing the user interface.

Redux: To handle global state for cryptocurrency data.

WebSocket: For real-time updates of cryptocurrency prices.

CSS: For styles in the table and components.

Axios: For API requests (if used in the future).

React-Redux: To handle state change between React components and Redux store.

Setup
Prerequisites
Node.js (v14+)

npm (Node Package Manager)

Steps to Run Locally
Clone the repository:

bash
Copy
Edit

cd crypto-live-tracker
Install Dependencies

Ensure you have Node.js installed. Install the necessary dependencies using the following command:

bash
Copy
Edit
npm install
Start Development Server:

To begin the application and view live updates locally, execute:

bash
Copy
Edit
npm start
This will begin a development server and launch the app in your browser at http://localhost:3000.

WebSocket Configuration:

The WebSocket connection is already configured to retrieve live cryptocurrency prices.

Make sure the WebSocket server endpoint (defined in services/websocketservices.js) works and delivers the necessary price data in real time.

File Structure
src/: Holds the root code for the app.

App.js: Top-level application component.

CryptoTable.js: Component for displaying the cryptocurrency market data.

store.js: Redux store setup.

websocketservices.js: Manages WebSocket connection and disconnection.

cryptotable.css: Styles for table layout and contents.



Acknowledgments
React and Redux: For making state management in React efficient and easy.

WebSocket: For offering real-time data updates to the app.
