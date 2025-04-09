import { configureStore } from "@reduxjs/toolkit";
import brandsReducer from "../store/brandSlice";
import productsReducer from "../store/prductSlice"; 
import usersReducer from "../store/userSlice";
import ordersReducer from "../store/orderSlice";
import referralReducer from "../store/referalSlice";
import brandReferralsReducer from "../store/brandReferalSlice";
import brandUsersReducer from "../store/brandsUserSlice";
import userBrandReferralsReducer from "../store/userBrandSlice";
import blogsReducer from "../store/blogSlice";

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    products: productsReducer,
    users: usersReducer,
    orders: ordersReducer,
    referrals: referralReducer,
    brandReferrals: brandReferralsReducer,
    brandUsers: brandUsersReducer,
    userBrandReferrals: userBrandReferralsReducer,
    blogs: blogsReducer,
  },
});

// ✅ Add these exports to fix the error
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
