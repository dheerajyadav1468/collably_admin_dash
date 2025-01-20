import { configureStore } from "@reduxjs/toolkit"
import brandsReducer from "./brandSlice"
import productsReducer from "./prductSlice"
import usersReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    products: productsReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

