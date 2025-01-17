import { configureStore } from '@reduxjs/toolkit';
import brandsReducer from './brandSlice';

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

