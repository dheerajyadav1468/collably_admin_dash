import { configureStore } from "@reduxjs/toolkit";
import brandsReducer from "../store/brandSlice";
import productsReducer from "../store/prductSlice"; // Fix typo: "prductSlice" -> "productSlice"
import usersReducer from "../store/userSlice";
import ordersReducer from "../store/orderSlice";

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    products: productsReducer,
    users: usersReducer,
    orders: ordersReducer,
  },
});

// ✅ Add these exports to fix the error
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
