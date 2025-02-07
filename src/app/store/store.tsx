import { configureStore } from "@reduxjs/toolkit"
import brandsReducer from "../store/brandSlice"
import productsReducer from "../store/prductSlice"
import usersReducer from "../store/userSlice"
import ordersReducer from "../store/orderSlice"

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    products: productsReducer,
    users: usersReducer,
    orders: ordersReducer,
  },
})

