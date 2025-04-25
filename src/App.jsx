import React from 'react';
import useCryptoSocket from './hooks/usecryptosocket';
import CryptoTable from './components/cryptotable';

function App() {
  useCryptoSocket(); // Connect to real-time data

  return (
    
    <div className="App">

     
      <CryptoTable />
    </div>
  );
}

export default App;
