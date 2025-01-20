import { configureStore } from '@reduxjs/toolkit';
import brandsReducer from './brandSlice';
import productsReducer from './prductSlice';

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

