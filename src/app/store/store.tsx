import { configureStore } from "@reduxjs/toolkit";
import brandsReducer from "../store/brandSlice";
import productsReducer from "../store/prductSlice"; // Fix typo: "prductSlice" -> "productSlice"
import usersReducer from "../store/userSlice";
import ordersReducer from "../store/orderSlice";
import referralReducer from "../store/referalSlice";
import brandReferralsReducer from "../store/brandReferalSlice";
export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    products: productsReducer,
    users: usersReducer,
    orders: ordersReducer,
    referrals: referralReducer,
    brandReferrals: brandReferralsReducer,
  },
});

// ✅ Add these exports to fix the error
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;