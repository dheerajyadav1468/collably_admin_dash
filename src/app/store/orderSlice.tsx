import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface Order {
  _id: string
  user: {
    _id: string
    fullname: string
    username: string
  }
  items: Array<{
    product: string
    quantity: number
    price: number
  }>
  totalAmount: number
  shippingAddress: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

interface OrdersState {
  orders: Order[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  error: null,
}

export const fetchAllOrders = createAsyncThunk("orders/fetchAllOrders", async () => {
  const response = await fetch(API_ROUTES.GET_ALL_ORDERS)
  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }
  return await response.json()
})

export const fetchProductDetails = createAsyncThunk("orders/fetchProductDetails", async (productId: string) => {
  const response = await fetch(API_ROUTES.GET_PRODUCT(productId))
  if (!response.ok) {
    throw new Error("Failed to fetch product details")
  }
  return await response.json()
})

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<{ orders: Order[] }>) => {
        state.status = "succeeded"
        state.orders = action.payload.orders
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch orders"
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        // You can add logic here if needed to update the state with product details
      })
  },
})

export default ordersSlice.reducer

