import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../features/cryptoslice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer
  }
});
